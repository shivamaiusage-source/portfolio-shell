import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => this.currentUser() !== null);
  user = this.currentUser.asReadonly();

  private apiUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient, private router: Router) {
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
    localStorage.setItem('ff_token', res.token);
    localStorage.setItem('ff_user', JSON.stringify(res.user));
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
