import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { MonitoringService, MonSession, MonStats } from '../../services/monitoring.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private svc = inject(MonitoringService);
  private router = inject(Router);

  stats = signal<MonStats | null>(null);
  sessions = signal<MonSession[]>([]);
  total = signal(0);
  isLoading = signal(true);
  selectedApp = signal('');
  errorsOnly = signal(false);
  refreshTimer: any;

  apps = [
    { label: 'All', value: '' },
    { label: 'Portfolio', value: 'Portfolio' },
    { label: 'FreeFlix', value: 'FreeFlix' },
    { label: 'RAG', value: 'RAG' },
  ];

  ngOnInit() {
    this.loadAll();
    // Auto refresh every 30 seconds
    this.refreshTimer = setInterval(() => this.loadAll(), 30000);
  }

  ngOnDestroy() {
    clearInterval(this.refreshTimer);
  }

  loadAll() {
    this.loadStats();
    this.loadSessions();
  }

  loadStats() {
    this.svc.getStats().subscribe(s => this.stats.set(s));
  }

  loadSessions() {
    this.isLoading.set(true);
    this.svc.getSessions({
      app: this.selectedApp() || undefined,
      errors_only: this.errorsOnly()
    }).subscribe({
      next: (res) => {
        this.sessions.set(res.sessions);
        this.total.set(res.total);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  setFilter(app: string) {
    this.selectedApp.set(app);
    this.loadSessions();
  }

  toggleErrors() {
    this.errorsOnly.update(v => !v);
    this.loadSessions();
  }

  openSession(id: string) {
    this.router.navigate(['/monitoring/session', id]);
  }

  formatDuration(ms: number): string {
    if (!ms || ms <= 0) return '0s';
    const s = Math.floor(ms / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    return `${m}m ${s % 60}s`;
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit'
    });
  }

  avgDuration(): string {
    return this.formatDuration(parseFloat(this.stats()?.avg_duration_ms || '0'));
  }

  maxSessions(): number {
    const s = this.stats();
    if (!s) return 1;
    return Math.max(
      +s.portfolio_sessions,
      +s.freeflix_sessions,
      +s.rag_sessions,
      1
    );
  }

  barWidth(count: string): string {
    return Math.round((+count / this.maxSessions()) * 100) + '%';
  }

  getBrowser(ua: string): string {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }
}
