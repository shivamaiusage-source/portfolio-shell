import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const FREEFLIX_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/ff-home.component').then(m => m.FfHomeComponent)
  },
  {
    path: 'browse',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/browse/browse.component').then(m => m.BrowseComponent)
  },
  {
    path: 'watch/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/watch/watch.component').then(m => m.WatchComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'my-list',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/my-list/my-list.component').then(m => m.MyListComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  }
];
