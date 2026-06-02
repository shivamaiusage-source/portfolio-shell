import { Component, OnInit, OnDestroy, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FfNavbarComponent } from '../../components/navbar/ff-navbar.component';
import { FreelixApiService } from '../../services/freeflix-api.service';
import Hls from 'hls.js';

@Component({
  selector: 'app-watch',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterLink, FfNavbarComponent],
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.scss'
})
export class WatchComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayer') videoRef!: ElementRef<HTMLVideoElement>;

  api = inject(FreelixApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  video = signal<any>(null);
  loading = signal(true);
  error = signal('');
  userRating = signal(0);
  isInMyList = signal(false);
  avgRating = signal<any>(null);

  // Quality signals
  currentQuality = signal('Auto');
  currentBitrate = signal(0);
  currentCodec = signal('');
  availableLevels = signal<any[]>([]);
  showQualityPanel = signal(false);
  selectedLevel = signal(-1); // -1 = Auto
  measuredBandwidth = signal(0); // actual measured Mbps

  private hls: Hls | null = null;
  private progressInterval: any;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/freeflix']); return; }

    this.api.getVideoById(+id).subscribe({
      next: (res) => {
        this.video.set(res.video);
        this.loading.set(false);
        setTimeout(() => this.initHls(res.video.hls_url), 100);
        this.api.getVideoRating(+id).subscribe({
          next: (r: any) => {
            this.avgRating.set(r.average);
            this.userRating.set(r.userRating || 0);
          }
        });
      },
      error: () => {
        this.error.set('Video not found');
        this.loading.set(false);
      }
    });
  }

  private initHls(hlsUrl: string) {
    const video = this.videoRef?.nativeElement;
    if (!video) return;

    if (Hls.isSupported()) {
      this.hls = new Hls({
        enableWorker: true,

        // Let ABR work naturally — just be more aggressive on upgrades
        startLevel: -1,              // Auto — HLS.js picks based on real bandwidth

        // Faster quality upgrades — don't be too conservative
        abrEwmaFastVoD: 2,          // react faster to bandwidth changes
        abrEwmaSlowVoD: 5,
        abrBandWidthFactor: 0.9,    // use 90% of measured bandwidth (default is 0.8)
        abrBandWidthUpFactor: 0.7,  // upgrade sooner when bandwidth improves

        // Bigger buffer = more stable playback
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });

      this.hls.loadSource(hlsUrl);
      this.hls.attachMedia(video);

      this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        // Build quality levels for UI selector
        const levels = data.levels.map((l: any, i: number) => ({
          index: i,
          height: l.height,
          bitrate: l.bitrate,
          codec: l.videoCodec || '',
          label: this.getLevelLabel(l)
        }));
        this.availableLevels.set(levels);
        video.play().catch(() => {});
      });

      // Update UI when quality level switches
      this.hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const level = this.hls!.levels[data.level];
        if (level) {
          this.currentBitrate.set(Math.round(level.bitrate / 1000));
          this.currentCodec.set(level.videoCodec || '');
          this.currentQuality.set(
            this.selectedLevel() === -1
              ? `Auto · ${level.height}p`
              : this.getLevelLabel(level)
          );
        }
      });

      // Track real measured bandwidth
      this.hls.on(Hls.Events.FRAG_LOADED, (event, data: any) => {
        if (this.hls?.bandwidthEstimate) {
          this.measuredBandwidth.set(
            Math.round(this.hls.bandwidthEstimate / 1000000 * 10) / 10
          );
        }
      });

      this.hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          this.error.set('Streaming error. Please try again.');
        }
      });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      video.play().catch(() => {});
    }

    this.progressInterval = setInterval(() => {
      if (video && !video.paused && this.video()) {
        this.api.saveHistory(this.video().id, Math.floor(video.currentTime)).subscribe();
      }
    }, 10000);
  }

  getLevelLabel(level: any): string {
    const codec = level.videoCodec || '';
    let codecName = 'H.264';
    if (codec.startsWith('hvc1') || codec.startsWith('hev1')) codecName = 'HEVC';
    if (codec.startsWith('av01')) codecName = 'AV1';
    const bitrate = Math.round(level.bitrate / 1000);
    return `${level.height}p · ${codecName} · ${bitrate}kbps`;
  }

  setQuality(levelIndex: number) {
    if (!this.hls) return;
    this.selectedLevel.set(levelIndex);
    if (levelIndex === -1) {
      this.hls.currentLevel = -1;
      this.currentQuality.set('Auto');
    } else {
      this.hls.currentLevel = levelIndex;
      const level = this.hls.levels[levelIndex];
      this.currentQuality.set(this.getLevelLabel(level));
    }
    this.showQualityPanel.set(false);
  }

  getCodecColor(codec: string): string {
    if (codec.startsWith('av01')) return '#a6e3a1';
    if (codec.startsWith('hvc1') || codec.startsWith('hev1')) return '#cba6f7';
    return '#89b4fa';
  }

  rate(stars: number) {
    this.userRating.set(stars);
    this.api.rateVideo(this.video().id, stars).subscribe({
      next: (res: any) => this.avgRating.set(res.average)
    });
  }

  toggleMyList() {
    const video = this.video();
    if (this.isInMyList()) {
      this.api.removeFromMyList(video.id).subscribe(() => this.isInMyList.set(false));
    } else {
      this.api.addToMyList(video.id).subscribe(() => this.isInMyList.set(true));
    }
  }

  ngOnDestroy() {
    if (this.hls) { this.hls.destroy(); }
    if (this.progressInterval) { clearInterval(this.progressInterval); }
  }
}
