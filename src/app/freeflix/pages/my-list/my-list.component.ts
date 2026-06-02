import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FfNavbarComponent } from '../../components/navbar/ff-navbar.component';
import { FreelixApiService } from '../../services/freeflix-api.service';

@Component({
  selector: 'app-my-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FfNavbarComponent],
  templateUrl: './my-list.component.html',
  styleUrl: './my-list.component.scss'
})
export class MyListComponent implements OnInit {
  api = inject(FreelixApiService);
  router = inject(Router);

  myList = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.api.getMyList().subscribe({
      next: (res) => {
        this.myList.set(res.myList);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  play(video: any) {
    this.router.navigate(['/freeflix/watch', video.video_id]);
  }

  remove(video: any) {
    this.api.removeFromMyList(video.video_id).subscribe(() => {
      this.myList.update(list => list.filter(v => v.video_id !== video.video_id));
    });
  }
}
