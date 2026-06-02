import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit, OnDestroy {

  stats = [
    { value: 3,  suffix: '+', prefix: '',  label: 'years_experience', sub: 'Jan 2023 → Present',            icon: '⚡', color: 'purple', progress: 75  },
    { value: 4,  suffix: '',  prefix: '',  label: 'live_projects',    sub: 'FreeFlix · RAG · Monitoring',   icon: '🚀', color: 'green',  progress: 100 },
    { value: 19, suffix: '',  prefix: 'v', label: 'angular_version',  sub: 'Signals · Standalone · SSR',    icon: '🅰️', color: 'blue',   progress: 95  },
    { value: 2,  suffix: '',  prefix: '',  label: 'companies',        sub: 'Songdew · Cavisson',            icon: '🏢', color: 'cyan',   progress: 50  },
  ];

  skills = [
    { label: 'Angular 19',    cls: 'tag-purple' },
    { label: 'TypeScript',    cls: 'tag-blue'   },
    { label: 'RxJS',          cls: 'tag-purple' },
    { label: 'Signals',       cls: 'tag-cyan'   },
    { label: 'Node.js',       cls: 'tag-green'  },
    { label: 'Express',       cls: 'tag-green'  },
    { label: 'PostgreSQL',    cls: 'tag-blue'   },
    { label: 'HLS.js',        cls: 'tag-red'    },
    { label: 'FFmpeg',        cls: 'tag-red'    },
    { label: 'Gemini AI',     cls: 'tag-yellow' },
    { label: 'D3.js',         cls: 'tag-cyan'   },
    { label: 'Chart.js',      cls: 'tag-yellow' },
    { label: 'Cloudflare R2', cls: 'tag-blue'   },
    { label: 'SCSS',          cls: 'tag-purple' },
    { label: 'Git',           cls: 'tag-green'  },
  ];

  // All values start at 0 — only increment when user scrolls to section
  displayValues: number[] = [0, 0, 0, 0];
  hasAnimated = false; // ensure animation only runs once

  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Wait for next tick so DOM is fully rendered before observing
    setTimeout(() => this.setupObserver(), 0);
  }

  private setupObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // Only trigger when section is actually visible AND hasn't animated yet
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.startCountUp();
            this.observer.disconnect(); // stop observing after first trigger
          }
        });
      },
      {
        threshold: 0.2, // trigger when 20% of section is visible
        rootMargin: '0px 0px -50px 0px' // slight offset from bottom of viewport
      }
    );

    // Observe the host element of THIS component directly
    this.observer.observe(this.el.nativeElement);
  }

  private startCountUp() {
    this.stats.forEach((stat, index) => {
      // Stagger start — each card starts 150ms after previous
      setTimeout(() => {
        this.animateCount(index, stat.value, 1200);
      }, index * 150);
    });
  }

  private animateCount(index: number, target: number, duration: number) {
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic — fast start, slow finish
      const eased = 1 - Math.pow(1 - progress, 3);
      this.displayValues[index] = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.displayValues[index] = target; // ensure exact final value
      }
    };

    requestAnimationFrame(step);
  }

  ngOnDestroy() {
    // Clean up observer to prevent memory leaks
    if (this.observer) this.observer.disconnect();
  }
}
