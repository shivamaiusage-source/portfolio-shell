import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isScrolled = signal(false);
  mobileOpen = signal(false);
  activeLink = signal('');
  navLinks = [
    { index: '01.', label: 'about',      href: '#about' },
    { index: '02.', label: 'experience', href: '#experience' },
    { index: '03.', label: 'projects',   href: '#projects' },
    { index: '04.', label: 'skills',     href: '#skills' },
  ];
  @HostListener('window:scroll')
  onScroll() { this.isScrolled.set(window.scrollY > 40); }
  setActive(label: string) { this.activeLink.set(label); }
  toggleMobile() { this.mobileOpen.update(v => !v); }
}
