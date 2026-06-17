import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface SeoConfig {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

const SEO_ROUTES: Record<string, SeoConfig> = {
  '/': {
    title: 'Shivam Singh | Senior Angular Developer',
    description: 'Senior Angular Developer with 3+ years experience. Built FreeFlix (HLS streaming), RAG System (AI document chat), and Frontend Monitoring Dashboard. Open to work.',
    url: 'https://shivamsingh.website'
  },
  '/freeflix': {
    title: 'FreeFlix — HLS Streaming Platform | Shivam Singh',
    description: 'Netflix-style HLS video streaming platform. FFmpeg pipeline with CMAF, H.264, HEVC, AV1 multi-codec. Cloudflare R2, Angular 19, Node.js, PostgreSQL.',
    url: 'https://shivamsingh.website/freeflix'
  },
  '/rag': {
    title: 'RAG System — AI Document Chat | Shivam Singh',
    description: 'Upload any PDF and get answers with source citations. Built with Gemini AI, pgvector semantic search, and Angular 19. Model fallback chain for reliability.',
    url: 'https://shivamsingh.website/rag'
  },
  '/rag/pdf': {
    title: 'PDF Chat — RAG System | Shivam Singh',
    description: 'Upload any PDF and ask questions. Gemini embeddings + pgvector cosine similarity search returns answers with exact page citations.',
    url: 'https://shivamsingh.website/rag/pdf'
  },
  '/rag/portfolio': {
    title: 'Portfolio Assistant — RAG System | Shivam Singh',
    description: 'Ask anything about Shivam Singh\'s projects, tech stack, and experience. Powered by Gemini AI with grounded generation.',
    url: 'https://shivamsingh.website/rag/portfolio'
  },
  '/monitoring': {
    title: 'Monitoring Dashboard | Shivam Singh',
    description: 'Framework-agnostic session recorder — captures clicks, scroll, navigation and JS errors. Angular dashboard with session replay and event timeline. Similar to Hotjar/Clarity.',
    url: 'https://shivamsingh.website/monitoring'
  }
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title  = inject(Title);
  private meta   = inject(Meta);
  private router = inject(Router);

  init() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      const url = e.urlAfterRedirects.split('?')[0];
      const config = SEO_ROUTES[url] || SEO_ROUTES['/'];
      this.apply(config);
    });
  }

  apply(config: SeoConfig) {
    // Title
    this.title.setTitle(config.title);

    // Primary
    this.meta.updateTag({ name: 'description', content: config.description });

    // OG
    this.meta.updateTag({ property: 'og:title',       content: config.title });
    this.meta.updateTag({ property: 'og:description',  content: config.description });
    this.meta.updateTag({ property: 'og:url',          content: config.url || 'https://shivamsingh.website' });

    // Twitter
    this.meta.updateTag({ name: 'twitter:title',       content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', config.url || 'https://shivamsingh.website');
    }
  }
}
