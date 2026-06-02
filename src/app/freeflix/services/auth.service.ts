import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  // Signal holding current user — null means not logged in
  private currentUser = signal<User | null>(null);

  // Computed signal — true if user is logged in
  isLoggedIn = computed(() => this.currentUser() !== null);

  // Public read-only access to current user
  user = this.currentUser.asReadonly();

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient, private router: Router) {
    // On app start, check if token exists in localStorage
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('ff_token');
    const user = localStorage.getItem('ff_user');
    if (token && user) {
      this.currentUser.set(JSON.parse(user));
    }
  }

  register(name: string, email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/register`, { name, email, password })
      .pipe(tap(res => this.handleAuthResponse(res)));
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(res => this.handleAuthResponse(res)));
  }

  private handleAuthResponse(res: any) {
    // Save token and user to localStorage
    localStorage.setItem('ff_token', res.token);
    localStorage.setItem('ff_user', JSON.stringify(res.user));
    // Update signal — triggers re-render in any component reading it
    this.currentUser.set(res.user);
  }

  logout() {
    localStorage.removeItem('ff_token');
    localStorage.removeItem('ff_user');
    this.currentUser.set(null);
    this.router.navigate(['/freeflix/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('ff_token');
  }
}
