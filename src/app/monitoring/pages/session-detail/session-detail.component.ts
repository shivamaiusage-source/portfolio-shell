import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MonitoringService, MonSession, MonEvent } from '../../services/monitoring.service';

@Component({
  selector: 'app-session-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-detail.component.html',
  styleUrl: './session-detail.component.scss'
})
export class SessionDetailComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private svc    = inject(MonitoringService);

  session   = signal<MonSession | null>(null);
  events    = signal<MonEvent[]>([]);
  isLoading = signal(true);
  activeFilter = signal<'all'|'click'|'nav'|'scroll'|'error'>('all');

  filteredEvents = computed(() => {
    const f = this.activeFilter();
    if (f === 'all') return this.events();
    return this.events().filter(e => e.type === f);
  });

  navEvents = computed(() =>
    this.events().filter(e => e.type === 'nav')
  );

  clickEvents = computed(() =>
    this.events().filter(e => e.type === 'click' && e.x !== null && e.y !== null)
  );

  totalMs = computed(() => this.session()?.duration_ms || 1);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.svc.getSessionDetail(id).subscribe({
      next: (res) => {
        this.session.set(res.session);
        this.events.set(res.events);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  goBack() { this.router.navigate(['/monitoring']); }

  setFilter(f: 'all'|'click'|'nav'|'scroll'|'error') {
    this.activeFilter.set(f);
  }

  dotLeft(ts: number): number {
    return Math.min(Math.round((ts / this.totalMs()) * 100), 99);
  }

  dotColor(type: string): string {
    const colors: any = {
      nav: '#378ADD', click: '#7F77DD',
      scroll: '#1D9E75', dom: '#9ca3af', error: '#E24B4A'
    };
    return colors[type] || '#9ca3af';
  }

  dotIcon(type: string): string {
    const icons: any = {
      nav: 'ti-arrow-right', click: 'ti-click',
      scroll: 'ti-arrows-down-up', dom: 'ti-layout',
      error: 'ti-alert-circle'
    };
    return icons[type] || 'ti-point';
  }

  iconClass(type: string): string {
    const classes: any = {
      nav: 'ic-nav', click: 'ic-click',
      scroll: 'ic-scroll', dom: 'ic-dom', error: 'ic-err'
    };
    return classes[type] || 'ic-dom';
  }

  // Format path nicely
  formatPath(path: string | null): string {
    if (!path || path === '/') return 'Home';
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) return 'Home';
    if (parts.length === 1) return '/' + parts[0];
    return '/' + parts.join('/');
  }

  // Get icon for nav path
  getNavIcon(path: string | null): string {
    if (!path || path === '/') return 'ti-home';
    if (path.includes('freeflix')) return 'ti-device-tv';
    if (path.includes('rag')) return 'ti-brain';
    if (path.includes('monitoring')) return 'ti-activity';
    return 'ti-arrow-right';
  }

  formatTs(ts: number): string {
    const base = this.events()[0]?.ts || 0;
    const diff = Math.round((ts - base) / 1000);
    const m = Math.floor(Math.abs(diff) / 60);
    const s = Math.abs(diff) % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  formatDuration(ms: number): string {
    if (!ms || ms <= 0) return '0s';
    const s = Math.floor(ms / 1000);
    if (s < 60) return `${s}s`;
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit'
    });
  }

  getBrowser(ua: string): string {
    if (ua?.includes('Chrome')) return 'Chrome';
    if (ua?.includes('Firefox')) return 'Firefox';
    if (ua?.includes('Safari')) return 'Safari';
    return 'Unknown';
  }

  clickX(e: MonEvent): number {
    return Math.round(((e.x || 0) / (this.session()?.screen_w || 1920)) * 100);
  }

  clickY(e: MonEvent): number {
    return Math.round(((e.y || 0) / (this.session()?.screen_h || 1080)) * 100);
  }

  timeLabels(): string[] {
    const total = this.totalMs();
    if (!total) return ['0:00'];
    const labels = [];
    for (let i = 0; i <= 4; i++) {
      const ms = (total / 4) * i;
      const s = Math.round(ms / 1000);
      labels.push(`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`);
    }
    return labels;
  }
}
