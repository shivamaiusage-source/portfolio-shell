import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FfNavbarComponent } from '../../components/navbar/ff-navbar.component';
import { FreelixApiService } from '../../services/freeflix-api.service';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, FormsModule, FfNavbarComponent],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss'
})
export class BrowseComponent implements OnInit {
  api = inject(FreelixApiService);
  router = inject(Router);

  videos = signal<any[]>([]);
  loading = signal(true);
  searchQuery = '';
  selectedGenre = signal('All');

  genres = ['All', 'Animation', 'Action', 'Drama', 'Sci-Fi', 'Comedy', 'Fantasy', 'Documentary'];

  // RxJS Subject for debounced search
  // Instead of calling API on every keystroke, wait 400ms after user stops typing
  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.loadVideos();

    // Subscribe to search with debounce
    // debounceTime(400) — waits 400ms after last keystroke
    // distinctUntilChanged() — only fires if value actually changed
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.loadVideos(query, this.selectedGenre() === 'All' ? undefined : this.selectedGenre());
    });
  }

  loadVideos(search?: string, genre?: string) {
    this.loading.set(true);
    this.api.getVideos(search, genre).subscribe({
      next: (res) => {
        this.videos.set(res.videos);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  // Called on every keystroke — pushes to Subject which debounces
  onSearch(query: string) {
    this.searchSubject.next(query);
  }

  selectGenre(genre: string) {
    this.selectedGenre.set(genre);
    const search = this.searchQuery || undefined;
    this.loadVideos(search, genre === 'All' ? undefined : genre);
  }

  play(video: any) {
    this.router.navigate(['/freeflix/watch', video.id]);
  }
}
