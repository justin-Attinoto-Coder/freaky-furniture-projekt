import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Install: npm install jwt-decode

interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

interface JwtPayload {
  id: string;
  role: string;
  name: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5186/api/auth';
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role'));
  private usernameSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));

  token$ = this.tokenSubject.asObservable();
  role$ = this.roleSubject.asObservable();
  username$ = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check token validity on service init
    this.validateStoredToken();
  }

  login(username: string, password: string): Observable<{ token: string, role: string, username: string }> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        const decodedToken = jwtDecode<JwtPayload>(response.accessToken);

        // Store token and user data
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('role', decodedToken.role);
        localStorage.setItem('username', decodedToken.name);

        // Update subjects
        this.tokenSubject.next(response.accessToken);
        this.roleSubject.next(decodedToken.role);
        this.usernameSubject.next(decodedToken.name);
      }),
      map(response => {
        const decodedToken = jwtDecode<JwtPayload>(response.accessToken);
        return {
          token: response.accessToken,
          role: decodedToken.role,
          username: decodedToken.name
        };
      }),
      catchError(error => {
        console.error('Login error:', error);
        const errorMessage = error.error?.error || error.error?.message || 'Login failed';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  register(username: string, password: string, confirmPassword: string): Observable<{ token: string, role: string, username: string }> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      username,
      password,
      confirmPassword
    }).pipe(
      tap(response => {
        const decodedToken = jwtDecode<JwtPayload>(response.accessToken);

        // Store token and user data
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('role', decodedToken.role);
        localStorage.setItem('username', decodedToken.name);

        // Update subjects
        this.tokenSubject.next(response.accessToken);
        this.roleSubject.next(decodedToken.role);
        this.usernameSubject.next(decodedToken.name);
      }),
      map(response => {
        const decodedToken = jwtDecode<JwtPayload>(response.accessToken);
        return {
          token: response.accessToken,
          role: decodedToken.role,
          username: decodedToken.name
        };
      }),
      catchError(error => {
        console.error('Registration error:', error);
        const errorMessage = error.error?.error || error.error?.message || 'Registration failed';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    this.tokenSubject.next(null);
    this.roleSubject.next(null);
    this.usernameSubject.next(null);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getRole(): string | null {
    return this.roleSubject.value;
  }

  getUsername(): string | null {
    return this.usernameSubject.value;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      return decodedToken.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  isAdmin(): boolean {
    return this.getRole()?.toLowerCase() === 'admin';
  }

  public getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  private validateStoredToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        if (decodedToken.exp * 1000 <= Date.now()) {
          // Token expired, clear storage
          this.logout();
        }
      } catch {
        // Invalid token, clear storage
        this.logout();
      }
    }
  }

  // Add this method to your AuthService
  refreshToken(): Observable<{ token: string, role: string, username: string }> {
    const currentToken = this.getToken();
    if (!currentToken) {
      return throwError(() => new Error('No token to refresh'));
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { token: currentToken }).pipe(
      tap(response => {
        const decodedToken = jwtDecode<JwtPayload>(response.accessToken);

        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('role', decodedToken.role);
        localStorage.setItem('username', decodedToken.name);

        this.tokenSubject.next(response.accessToken);
        this.roleSubject.next(decodedToken.role);
        this.usernameSubject.next(decodedToken.name);
      }),
      map(response => {
        const decodedToken = jwtDecode<JwtPayload>(response.accessToken);
        return {
          token: response.accessToken,
          role: decodedToken.role,
          username: decodedToken.name
        };
      }),
      catchError(error => {
        this.logout(); // Auto-logout on refresh failure
        return throwError(() => new Error('Token refresh failed'));
      })
    );
  }
}
