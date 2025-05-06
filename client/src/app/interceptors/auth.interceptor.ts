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
  const publicRoutes = ['/api/users/login', '/api/users/register'];
  if (publicRoutes.some(route => req.url.includes(route))) {
    return next(req);
  }

  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  } else {
    // Only redirect for protected routes
    if (req.url.includes('/api/users/me') || req.url.includes('/api/furniture') || req.url.includes('/api/cart')) {
      router.navigate(['/login']);
      return throwError(() => new Error('No token'));
    }
  }

  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        console.log('Token expired or invalid, redirecting to login...');
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
