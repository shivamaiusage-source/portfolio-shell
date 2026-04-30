/* ============================================================
   PROJECTS.COMPONENT.TS — Project Cards Grid
   Displays all 4 portfolio projects as interactive cards.

   TypeScript concepts used:
   - Interface with typed properties
   - Array typed with interface: Project[]
   - Optional chaining and union types

   Angular concepts:
   - [class.wip] — conditional class binding
   - [style.background] — inline style binding with expression
   - (click) — event binding
   ============================================================ */

import { Component } from '@angular/core';

/* TypeScript Interface — defines the exact shape each project object must have.
   This gives us autocomplete, type checking, and self-documenting code.
   If we try to add a project without 'name', TypeScript shows an error. */
interface Project {
  name: string;    /* Display name e.g. "Netflix Clone" */
  slug: string;    /* URL-friendly name e.g. "netflix-clone" */
  desc: string;    /* Short description */
  tech: string[];  /* Array of tech stack labels */
  url: string;     /* Live URL without https:// */
  live: boolean;   /* true = LIVE badge, false = WIP badge */
  emoji: string;   /* Icon for the card */
  color: string;   /* Hex color for icon background tint */
}

@Component({
  selector: 'app-projects',
  standalone: true,
  template: `
    <!-- id="projects" = anchor target for navbar link -->
    <section class="projects-section" id="projects">
      <div class="container">

        <!-- Section header -->
        <div class="section-header">
          <span class="section-tag mono">// 03. projects</span>
          <h2 class="section-title">Things I've Built</h2>
        </div>

        <!-- Project cards grid
             @for with TypeScript-typed array — full type safety in template -->
        <div class="projects-grid">
          @for (p of projects; track p.slug) {

            <!-- [class.wip] = conditional class binding
                 Adds 'wip' class to element when p.live is false.
                 Equivalent to: class="{{ !p.live ? 'proj-card wip' : 'proj-card' }}"
                 but cleaner and more readable. -->
            <div class="proj-card" [class.wip]="!p.live" (click)="open(p.url)">

              <div class="proj-top">
                <!-- [style.background] = inline style binding
                     p.color + '22' appends hex alpha (22 = ~13% opacity)
                     e.g. '#f38ba8' + '22' = '#f38ba822' -->
                <div class="proj-icon" [style.background]="p.color + '22'">
                  {{ p.emoji }}
                </div>

                <!-- [class.live] and [class.wip] add classes conditionally
                     Both bindings can coexist on the same element -->
                <span class="proj-badge" [class.live]="p.live" [class.wip]="!p.live">
                  {{ p.live ? '● LIVE' : '◌ WIP' }}
                </span>
              </div>

              <!-- Template expression {{ }} renders the value as text -->
              <h3 class="proj-name mono">{{ p.slug }}/</h3>
              <p class="proj-desc">{{ p.desc }}</p>

              <!-- Nested @for — loop inside a loop for tech tags -->
              <div class="proj-tags">
                @for (t of p.tech; track t) {
                  <span class="proj-tag mono">{{ t }}</span>
                }
              </div>

              <div class="proj-url mono">
                <span class="url-arrow">↗</span> {{ p.url }}
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .projects-section { padding: 80px 0; }
    .section-header { margin-bottom: 40px; }
    .section-tag { font-size: 12px; color: var(--green); display: block; margin-bottom: 8px; }
    .section-title { font-size: 32px; font-weight: 600; color: var(--text); letter-spacing: -0.02em; }

    /* CSS Grid — auto-fit creates as many columns as fit at min 260px each.
       On wide screens: 4 columns. On narrow: 2 or 1. No media queries needed.
       Interview tip: "auto-fit with minmax is more flexible than fixed columns
       because it automatically adapts to container width." */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
    }

    .proj-card {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 20px;
      cursor: pointer;
      transition: all var(--transition);
      display: flex; flex-direction: column; gap: 12px;
      position: relative; overflow: hidden;
    }

    /* ::before pseudo-element creates a top border glow effect on hover.
       It's normally invisible (opacity: 0) and fades in on hover.
       The gradient goes: transparent → border color → transparent
       creating a centered glow rather than a solid line. */
    .proj-card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border), transparent);
      opacity: 0; transition: opacity var(--transition);
    }
    .proj-card:hover { border-color: rgba(203,166,247,0.3); transform: translateY(-2px); }
    .proj-card:hover::before { opacity: 1; } /* Reveal top glow on hover */

    /* WIP cards look de-emphasized — dashed border, no hover lift */
    .proj-card.wip { border-style: dashed; cursor: default; opacity: 0.7; }
    .proj-card.wip:hover { transform: none; } /* Disable hover effect for WIP */

    .proj-top { display: flex; justify-content: space-between; align-items: center; }
    .proj-icon {
      width: 36px; height: 36px; border-radius: var(--radius);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
    }

    .proj-badge { font-size: 10px; font-family: var(--font-mono); padding: 2px 8px; border-radius: 3px; }
    .proj-badge.live { color: var(--green); background: var(--green-dim); }
    .proj-badge.wip  { color: var(--yellow); background: rgba(249,226,175,0.1); }

    .proj-name { font-size: 14px; font-weight: 500; color: var(--purple); }
    .proj-desc { font-size: 13px; color: var(--text-muted); line-height: 1.6; flex: 1; }

    .proj-tags { display: flex; flex-wrap: wrap; gap: 5px; }
    .proj-tag {
      font-size: 10px; color: var(--blue);
      border: 1px solid var(--border); border-radius: 3px;
      padding: 2px 7px; background: var(--bg);
    }

    /* margin-top: auto pushes URL to bottom of card regardless of desc length
       This creates consistent card height alignment in the grid */
    .proj-url { font-size: 10px; color: var(--text-dim); display: flex; align-items: center; gap: 5px; margin-top: auto; }
    .url-arrow { color: var(--green); }

    @media (max-width: 600px) {
      .projects-section { padding: 48px 0; }
      .section-title { font-size: 24px; }
    }
  `]
})
export class ProjectsComponent {
  /* Typed array with our interface — TypeScript will error if any
     project object is missing a required field */
  projects: Project[] = [
    {
      name: 'Netflix Clone',
      slug: 'netflix-clone',
      desc: 'Video streaming platform with search, watch history, ratings, and full session recording via custom recorder.',
      tech: ['Angular 19', 'Node.js', 'PostgreSQL', 'JWT Auth'],
      url: 'netflix.shivamsingh.website',
      live: true, emoji: '🎬', color: '#f38ba8'
    },
    {
      name: 'RAG System',
      slug: 'rag-system',
      desc: 'Upload any PDF and ask questions. Powered by Gemini AI + pgvector embeddings for semantic document search.',
      tech: ['Gemini AI', 'pgvector', 'Node.js', 'Angular 19'],
      url: 'rag.shivamsingh.website',
      live: true, emoji: '🤖', color: '#a6e3a1'
    },
    {
      name: 'Monitoring Dashboard',
      slug: 'monitoring',
      desc: 'Session replay, heatmaps, and performance metrics from both Netflix and RAG apps. Built on Cavisson expertise.',
      tech: ['Session Replay', 'D3.js', 'Chart.js', 'Angular 19'],
      url: 'monitoring.shivamsingh.website',
      live: true, emoji: '📊', color: '#89b4fa'
    },
    {
      name: 'Coming Soon',
      slug: 'coming-soon',
      desc: 'Next project in progress. Building something new with Angular 19 and modern tooling.',
      tech: ['Angular 19', '???'],
      url: 'shivamsingh.website',
      live: false, emoji: '⚡', color: '#f9e2af'
    },
  ];

  /* Opens project URL in a new browser tab.
     window.open() is a browser global — in tests this would need mocking. */
  open(url: string) {
    window.open(`https://${url}`, '_blank');
  }
}
