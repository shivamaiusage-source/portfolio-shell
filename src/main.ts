/* ============================================================
   MAIN.TS — Application Entry Point
   This is the first file Angular runs when the app starts.
   It bootstraps (starts) the root component with configuration.

   Interview tip: "In Angular 19 standalone apps, we no longer
   need AppModule. bootstrapApplication() replaces it, taking
   the root component and a config object directly."
   ============================================================ */

// bootstrapApplication = the function that starts a standalone Angular app
import { bootstrapApplication } from '@angular/platform-browser';

// Our app configuration (router, providers) defined in app.config.ts
import { appConfig } from './app/app.config';

// The root component — the top-level component Angular renders first
import { AppComponent } from './app/app.component';

// Start the app. If anything fails during bootstrap, log it to console.
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
