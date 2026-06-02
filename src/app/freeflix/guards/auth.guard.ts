import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Functional guard — Angular 17+ recommended approach
// No class needed — just a function
export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true; // Allow navigation
  }

  // Redirect to login if not authenticated
  router.navigate(['/freeflix/login']);
  return false;
};
