import { HttpClient } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.models';

const TOKEN_KEY = 'auth_token';
const EXPIRES_AT_KEY = 'auth_expires_at';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.moviesApiUrl}/auth`;

  private readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly expiresAt = signal<string | null>(localStorage.getItem(EXPIRES_AT_KEY));

  readonly isAuthenticated = computed(() => {
    const token = this.token();
    const expiresAt = this.expiresAt();
    if (!token || !expiresAt) return false;
    return new Date(expiresAt).getTime() > Date.now();
  });

  register(request: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
      tap((response) => this.setSession(response)),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
    this.token.set(null);
    this.expiresAt.set(null);
  }

  getToken(): string | null {
    return this.token();
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(EXPIRES_AT_KEY, response.expiresAt);
    this.token.set(response.token);
    this.expiresAt.set(response.expiresAt);
  }
}
