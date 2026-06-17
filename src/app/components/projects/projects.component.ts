import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

interface Project {
  name: string;
  slug: string;
  tagline: string;
  desc: string;
  tech: string[];
  route: string;
  url: string;
  live: boolean;
  emoji: string;
  accentColor: string;
  iconBg: string;
  iconColor: string;
  tiIcon: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {

  private router = inject(Router);

  // Track which cards are flipped (for mobile tap support)
  flippedCards = new Set<string>();

  projects: Project[] = [
    {
      name: 'FreeFlix',
      slug: 'freeflix',
      tagline: 'Real HLS streaming — FFmpeg, CMAF, H.264, HEVC, AV1 multi-codec pipeline.',
      desc: 'Netflix-style streaming platform with adaptive bitrate, JWT auth, watch history, ratings and My List.',
      tech: ['Angular 19', 'HLS.js', 'Node.js', 'FFmpeg', 'Cloudflare R2', 'PostgreSQL'],
      route: '/freeflix',
      url: 'shivamsingh.website/freeflix',
      live: true,
      emoji: '🎬',
      accentColor: '#f38ba8',
      iconBg: '#FCEBEB',
      iconColor: '#A32D2D',
      tiIcon: 'ti-device-tv'
    },
    {
      name: 'RAG System',
      slug: 'rag',
      tagline: 'Upload PDF, ask questions. Gemini AI + pgvector semantic search with citations.',
      desc: 'Document intelligence platform — upload any PDF and get answers with exact source citations.',
      tech: ['Gemini AI', 'pgvector', 'Node.js', 'Angular 19', 'PostgreSQL'],
      route: '/rag',
      url: 'shivamsingh.website/rag',
      live: true,
      emoji: '🤖',
      accentColor: '#a6e3a1',
      iconBg: '#E1F5EE',
      iconColor: '#0F6E56',
      tiIcon: 'ti-brain'
    },
    {
      name: 'Monitoring',
      slug: 'monitoring',
      tagline: 'Framework-agnostic session recorder — clicks, navigation, errors. Replay dashboard.',
      desc: 'Vanilla JS recorder injected via script tag. Captures clicks, scroll, navigation and JS errors. Angular dashboard with session replay and event timeline.',
      tech: ['Vanilla JS', 'Angular 19', 'Node.js', 'PostgreSQL', 'pgvector'],
      route: '/monitoring',
      url: 'shivamsingh.website/monitoring',
      live: true,
      emoji: '📊',
      accentColor: '#89b4fa',
      iconBg: '#E6F1FB',
      iconColor: '#185FA5',
      tiIcon: 'ti-activity'
    },
    {
      name: 'Coming Soon',
      slug: 'coming-soon',
      tagline: 'Next project in progress. Building something new with Angular 19.',
      desc: 'Stay tuned — something exciting is in progress.',
      tech: ['Angular 19', '???'],
      route: '/',
      url: 'shivamsingh.website',
      live: false,
      emoji: '⚡',
      accentColor: '#f9e2af',
      iconBg: '#FAEEDA',
      iconColor: '#854F0B',
      tiIcon: 'ti-bolt'
    }
  ];

  // Toggle flip state — used for mobile tap
  toggleFlip(slug: string): void {
    if (this.flippedCards.has(slug)) {
      this.flippedCards.delete(slug);
    } else {
      this.flippedCards.add(slug);
    }
  }

  isFlipped(slug: string): boolean {
    return this.flippedCards.has(slug);
  }

  // Navigate to project — only for live projects
  openProject(event: Event, project: Project): void {
    event.stopPropagation(); // prevent card flip when clicking button
    if (project.live) {
      this.router.navigate([project.route]);
    }
  }
}