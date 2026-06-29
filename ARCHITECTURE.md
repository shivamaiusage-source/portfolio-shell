# portfolio-shell — Full Architecture

```
╔══════════════════════════════════════════════════════════════════════╗
║                     PORTFOLIO-SHELL (Angular 19)                     ║
║                      shivamsingh.website                             ║
╚══════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│  src/main.ts  →  bootstrapApplication(AppComponent, appConfig)      │
└────────────────────────────┬────────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│  AppComponent  (app.component.html)                                 │
│                                                                     │
│   <app-navbar />          ← always visible, sticky                  │
│   <main>                                                            │
│     <router-outlet />     ← swaps page content here                 │
│   </main>                                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Current Routes (`app.config.ts`)

```
ROUTE TABLE
───────────────────────────────────────────────────────────────
 Path    Component              How Loaded
───────────────────────────────────────────────────────────────
  ''     HomePageComponent      lazy (import('./pages/home'))
───────────────────────────────────────────────────────────────
```

---

## Home Page Anatomy (`/`)

```
┌─────────────────────────────────────────────────────────────────────┐
│  HomePageComponent  (pages/home/home.component.html)                │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  <app-hero />                           id="about"           │   │
│  │  ┌────────────────────────┐  ┌────────────────────────────┐  │   │
│  │  │  hero-left             │  │  hero-right                │  │   │
│  │  │  • // hello world tag  │  │  <app-terminal />          │  │   │
│  │  │  • Hi, I'm Shivam Singh│  │  (animated terminal sim)   │  │   │
│  │  │  • Senior Angular Dev  │  │                            │  │   │
│  │  │  • CTA buttons:        │  └────────────────────────────┘  │   │
│  │  │    ls projects/ ↵      │                                   │   │
│  │  │    cat resume.pdf      │                                   │   │
│  │  └────────────────────────┘                                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  <app-stats />                          id="experience"      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  <div class="container">                                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  <app-projects />                       id="projects"        │   │
│  │                                                              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │   │
│  │  │🎬 netflix│  │🤖 rag-   │  │📊 monit- │  │⚡ coming │   │   │
│  │  │  -clone/ │  │  system/ │  │  oring/  │  │  -soon/  │   │   │
│  │  │  LIVE    │  │  LIVE    │  │  LIVE    │  │  WIP     │   │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│  </div>                                                             │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  <app-footer />                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Navbar Anchor Links

```
Navbar → [href="#about"]      scrolls to <app-hero>
         [href="#experience"] scrolls to <app-stats>
         [href="#projects"]   scrolls to <app-projects>
         [href="#skills"]     (section to be added)
```

---

## Merging Sub-Projects Into portfolio-shell

The cleanest approach for an Angular portfolio: **lazy-loaded feature modules as child routes**.
Each sub-project lives at its own route inside the shell.
No iframes, no micro-frontend overhead.

---

## Target Route Table

```
ROUTE TABLE (proposed)
───────────────────────────────────────────────────────────────────────
 Path               Component / Module         Sub-project
───────────────────────────────────────────────────────────────────────
  ''                HomePageComponent          portfolio home
  'free-flix'       FREE_FLIX_ROUTES            Free Flix / Netflix Clone
  'free-flix/**'    (child routes inside)
  'rag'             RAG_ROUTES                  RAG System
  'rag/**'          (child routes inside)
  'monitoring'      MONITORING_ROUTES           Frontend Monitoring
  'monitoring/**'   (child routes inside)
  '**'              NotFoundComponent          404 fallback
───────────────────────────────────────────────────────────────────────
```

---

## Final File Structure

```
portfolio-shell/
├── src/
│   ├── app/
│   │   ├── app.component.ts          ← Navbar + router-outlet
│   │   ├── app.config.ts             ← Route definitions (add 3 lazy routes)
│   │   │
│   │   ├── components/
│   │   │   ├── navbar/               ← add routerLink for each project
│   │   │   ├── hero/
│   │   │   ├── stats/
│   │   │   ├── terminal/
│   │   │   ├── projects/             ← cards now use routerLink, not window.open
│   │   │   └── footer/
│   │   │
│   │   ├── pages/
│   │   │   ├── home/                 ← existing home page (unchanged)
│   │   │   └── not-found/            ← add 404 page
│   │   │
│   │   ├── free-flix/                ← MOVED from Free Flix repo
│   │   │   ├── free-flix.routes.ts
│   │   │   ├── pages/
│   │   │   │   ├── home/             (browse movies)
│   │   │   │   ├── watch/            (video player)
│   │   │   │   ├── search/
│   │   │   │   └── profile/
│   │   │   ├── components/
│   │   │   │   ├── movie-card/
│   │   │   │   ├── video-player/
│   │   │   │   └── session-recorder/ (custom replay)
│   │   │   └── services/
│   │   │       ├── movie.service.ts
│   │   │       └── auth.service.ts
│   │   │
│   │   ├── rag/                      ← MOVED from RAG repo
│   │   │   ├── rag.routes.ts
│   │   │   ├── pages/
│   │   │   │   ├── upload/           (PDF upload)
│   │   │   │   └── chat/             (ask questions)
│   │   │   ├── components/
│   │   │   │   ├── file-drop/
│   │   │   │   ├── chat-window/
│   │   │   │   └── source-card/
│   │   │   └── services/
│   │   │       └── rag.service.ts
│   │   │
│   │   └── monitoring/               ← MOVED from Monitoring repo
│   │       ├── monitoring.routes.ts
│   │       ├── pages/
│   │       │   ├── dashboard/        (overview)
│   │       │   ├── sessions/         (replay list)
│   │       │   ├── replay/           (session player)
│   │       │   └── heatmap/
│   │       ├── components/
│   │       │   ├── replay-player/
│   │       │   ├── heatmap-canvas/   (D3.js)
│   │       │   └── metric-chart/     (Chart.js)
│   │       └── services/
│   │           └── monitoring.service.ts
│   │
│   ├── environments/
│   │   ├── environment.ts            ← dev API URLs
│   │   └── environment.prod.ts       ← prod API URLs
│   │
│   ├── styles.scss                   ← shared design tokens (CSS vars)
│   └── index.html
```

---

## `app.config.ts` — Updated Routes

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      [
        {
          path: '',
          loadComponent: () =>
            import('./pages/home/home.component').then(m => m.HomePageComponent),
        },
        {
          path: 'free-flix',
          loadChildren: () =>
            import('./free-flix/free-flix.routes').then(m => m.FREE_FLIX_ROUTES),
        },
        {
          path: 'rag',
          loadChildren: () =>
            import('./rag/rag.routes').then(m => m.RAG_ROUTES),
        },
        {
          path: 'monitoring',
          loadChildren: () =>
            import('./monitoring/monitoring.routes').then(m => m.MONITORING_ROUTES),
        },
        {
          path: '**',
          loadComponent: () =>
            import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
        },
      ],
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ),
  ],
};
```

---

## `free-flix/free-flix.routes.ts`

```typescript
import { Routes } from '@angular/router';

export const FREE_FLIX_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/ff-home.component').then(m => m.FfHomeComponent),
  },
  {
    path: 'watch/:id',
    loadComponent: () =>
      import('./pages/watch/watch.component').then(m => m.WatchComponent),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./pages/search/search.component').then(m => m.SearchComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(m => m.ProfileComponent),
  },
];
```

---

## `rag/rag.routes.ts`

```typescript
import { Routes } from '@angular/router';

export const RAG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/upload/upload.component').then(m => m.UploadComponent),
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./pages/chat/chat.component').then(m => m.ChatComponent),
  },
];
```

---

## `monitoring/monitoring.routes.ts`

```typescript
import { Routes } from '@angular/router';

export const MONITORING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'sessions',
    loadComponent: () =>
      import('./pages/sessions/sessions.component').then(m => m.SessionsComponent),
  },
  {
    path: 'replay/:id',
    loadComponent: () =>
      import('./pages/replay/replay.component').then(m => m.ReplayComponent),
  },
  {
    path: 'heatmap',
    loadComponent: () =>
      import('./pages/heatmap/heatmap.component').then(m => m.HeatmapComponent),
  },
];
```

---

## Project Cards — Switch to `routerLink`

Update `projects.component.ts` — replace `window.open()` with Angular Router:

```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

// In ProjectsComponent class:
constructor(private router: Router) {}

open(slug: string) {
  this.router.navigate([`/${slug}`]);
}
```

Update the `projects` array slugs to match routes:

```typescript
projects: Project[] = [
  {
    name: 'Free Flix',
    slug: 'free-flix',
    desc: 'Video streaming platform with search, watch history, ratings, and full session recording via custom recorder.',
    tech: ['Angular 19', 'Node.js', 'PostgreSQL', 'JWT Auth'],
    url: '/free-flix',
    live: true, emoji: '🎬', color: '#f38ba8'
  },
  {
    name: 'RAG System',
    slug: 'rag',
    desc: 'Upload any PDF and ask questions. Powered by Gemini AI + pgvector embeddings for semantic document search.',
    tech: ['Gemini AI', 'pgvector', 'Node.js', 'Angular 19'],
    url: '/rag',
    live: true, emoji: '🤖', color: '#a6e3a1'
  },
  {
    name: 'Monitoring Dashboard',
    slug: 'monitoring',
    desc: 'Session replay, heatmaps, and performance metrics. Built on Cavisson expertise.',
    tech: ['Session Replay', 'D3.js', 'Chart.js', 'Angular 19'],
    url: '/monitoring',
    live: true, emoji: '📊', color: '#89b4fa'
  },
  {
    name: 'Coming Soon',
    slug: 'coming-soon',
    desc: 'Next project in progress. Building something new with Angular 19 and modern tooling.',
    tech: ['Angular 19', '???'],
    url: '/',
    live: false, emoji: '⚡', color: '#f9e2af'
  },
];
```

---

## URL Structure After Merge

```
shivamsingh.website/                        → portfolio home
shivamsingh.website/free-flix               → Free Flix browse
shivamsingh.website/free-flix/watch/42      → video player
shivamsingh.website/free-flix/search        → search results
shivamsingh.website/rag                     → PDF upload
shivamsingh.website/rag/chat                → chat interface
shivamsingh.website/monitoring              → dashboard
shivamsingh.website/monitoring/sessions     → session list
shivamsingh.website/monitoring/replay/7     → replay player
shivamsingh.website/monitoring/heatmap      → heatmap view
```

---

## Migration Steps (in order)

```
Step 1 — Scaffold folders inside portfolio-shell/src/app/
   mkdir free-flix rag monitoring pages/not-found

Step 2 — Copy each sub-project's src/app/* into the matching folder
   free-flix repo  src/app  →  portfolio-shell src/app/free-flix
   rag repo        src/app  →  portfolio-shell src/app/rag
   monitoring repo src/app  →  portfolio-shell src/app/monitoring

Step 3 — Create *.routes.ts per sub-project (see above)

Step 4 — Update app.config.ts with the 3 lazy loadChildren routes

Step 5 — Add provideHttpClient() to app.config.ts providers (once, shared)

Step 6 — Update projects.component.ts to use Router.navigate()

Step 7 — Move all CSS variables from sub-project styles into styles.scss

Step 8 — Create src/environments/environment.ts with all API base URLs
         Each service reads from environment instead of hardcoded URLs

Step 9 — Update Navbar to show back-arrow when inside a sub-project route
         Use Router.url to detect if current path starts with a project slug
```

---

## Key Rules During Migration

- Each sub-project's `styles.scss` CSS variables → merge into shell's global `styles.scss` (no duplication)
- `provideHttpClient()` goes in `app.config.ts` once — sub-projects do NOT re-provide it
- Sub-projects **never** call `bootstrapApplication` — they are route modules only
- All API base URLs → `src/environments/environment.ts` (dev) and `environment.prod.ts` (prod)
- Sub-project components stay standalone — no NgModules needed (Angular 19)
