import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/users';
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role'));
  token$ = this.tokenSubject.asObservable();
  role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ token: string, role: string }> {
    return this.http.post<{ id: number, username: string, role: string, token: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        this.tokenSubject.next(response.token);
        this.roleSubject.next(response.role);
      }),
      map(response => ({ token: response.token, role: response.role })),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.error?.message || 'Login failed'));
      })
    );
  }

  register(username: string, password: string, role: string = 'user'): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, { username, password, role }).pipe(
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => new Error(error.error?.message || 'Registration failed'));
      })
    );
  }

  getUserData(): Observable<{ username: string, role: string }> {
    return this.http.get<{ id: number, username: string, role: string }>(`${this.apiUrl}/me`, {
      headers: this.getHeaders()
    }).pipe(
      map(user => ({ username: user.username, role: user.role })),
      catchError(error => {
        console.error('Error fetching user data:', error);
        return throwError(() => new Error('Failed to fetch user data'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.tokenSubject.next(null);
    this.roleSubject.next(null);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getRole(): string | null {
    return this.roleSubject.value;
  }

  public getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
}
