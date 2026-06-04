import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './freeflix/services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(
      [
        {
          path: '',
          loadComponent: () =>
            import('./pages/home/home.component').then(m => m.HomePageComponent)
        },
        {
          path: 'freeflix',
          loadChildren: () =>
            import('./freeflix/freeflix.routes').then(m => m.FREEFLIX_ROUTES)
        },
        {
          path: 'rag',
          loadChildren: () =>
            import('./rag/rag.routes').then(m => m.RAG_ROUTES)
        },
        {
          path: '**',
          redirectTo: ''
        }
      ],
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    ),
  ]
};
