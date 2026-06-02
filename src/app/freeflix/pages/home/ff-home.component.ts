import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FfNavbarComponent } from '../../components/navbar/ff-navbar.component';
import { FreelixApiService } from '../../services/freeflix-api.service';

@Component({
  selector: 'app-ff-home',
  standalone: true,
  imports: [CommonModule, FfNavbarComponent],
  templateUrl: './ff-home.component.html',
  styleUrl: './ff-home.component.scss'
})
export class FfHomeComponent implements OnInit {
  api = inject(FreelixApiService);
  router = inject(Router);

  videos = signal<any[]>([]);
  featuredVideo = signal<any>(null);
  loading = signal(true);

  ngOnInit() {
    this.api.getVideos().subscribe({
      next: (res) => {
        this.videos.set(res.videos);
        this.featuredVideo.set(res.videos[0]);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  play(video: any) {
    this.router.navigate(['/freeflix/watch', video.id]);
  }
}
