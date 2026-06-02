import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FfNavbarComponent } from '../../components/navbar/ff-navbar.component';
import { FreelixApiService } from '../../services/freeflix-api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FfNavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  api = inject(FreelixApiService);
  auth = inject(AuthService);
  router = inject(Router);

  history = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.api.getHistory().subscribe({
      next: (res) => {
        this.history.set(res.history);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  play(item: any) {
    this.router.navigate(['/freeflix/watch', item.video_id]);
  }

  logout() { this.auth.logout(); }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  formatProgress(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
