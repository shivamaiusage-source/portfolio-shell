import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './freeflix/services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Add HTTP client + JWT interceptor
    provideHttpClient(withInterceptors([authInterceptor])),

    provideRouter([
      // Existing route — portfolio home (unchanged)
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then(m => m.HomePageComponent)
      },
      // New — FreeFlix lazy loaded feature
      {
        path: 'freeflix',
        loadChildren: () =>
          import('./freeflix/freeflix.routes').then(m => m.FREEFLIX_ROUTES)
      },
      // Fallback
      {
        path: '**',
        redirectTo: ''
      }
    ],
    withInMemoryScrolling({
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    }))
  ]
};
