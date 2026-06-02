import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ff-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './ff-navbar.component.html',
  styleUrl: './ff-navbar.component.scss'
})
export class FfNavbarComponent {
  auth = inject(AuthService);
  router = inject(Router);
  showDropdown = signal(false);

  // true = user has scrolled down — hide FreeFlix nav, show portfolio nav
  isScrolled = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 80);
  }

  toggleDropdown() { this.showDropdown.update(v => !v); }

  logout() {
    this.auth.logout();
    this.showDropdown.set(false);
  }

  goToBrowse() { this.router.navigate(['/freeflix/browse']); }
}
