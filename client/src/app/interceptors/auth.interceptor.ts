import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
  let authReq = req;

  // Skip token check for public routes
  const publicRoutes = ['/api/users/login', '/api/users/register', '/api/customers', '/api/shipping-details', '/api/payment-details'];
  if (publicRoutes.some(route => req.url.includes(route))) {
    console.log('AuthInterceptor: Public route, skipping token check:', req.url);
    return next(req);
  }

  console.log('AuthInterceptor: Processing request:', req.url, 'Token:', token);

  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  } else {
    // Only redirect for protected routes
    if (req.url.includes('/api/users/me') || req.url.includes('/api/furniture') || req.url.includes('/api/cart')) {
      console.log('AuthInterceptor: No token for protected route, redirecting to login:', req.url);
      router.navigate(['/login']);
      return throwError(() => new Error('No token'));
    }
  }

  return next(authReq).pipe(
    catchError(error => {
      console.error('AuthInterceptor: Request error:', error, 'Status:', error.status);
      if (error.status === 401) {
        console.log('AuthInterceptor: Token expired or invalid, redirecting to login...');
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};