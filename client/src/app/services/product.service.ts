import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Product } from '../models/product';

export type { Product };

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://freaky-angular-furniture-backend.onrender.com/api/furniture';
  private cachedItems: Product[] | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  getFurnitureItems(): Observable<Product[]> {
    if (this.cachedItems) {
      return of(this.cachedItems);
    }
    return this.http.get<Product[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      tap(items => this.cachedItems = items),
      catchError(error => {
        console.error('Error fetching furniture items:', error);
        return throwError(() => new Error('Failed to fetch products'));
      })
    );
  }

  getProducts(category?: string): Observable<Product[]> {
    const url = category ? `${this.apiUrl}?category=${category}` : this.apiUrl;
    return this.http.get<Product[]>(url, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching products:', error);
        return throwError(() => new Error('Failed to fetch products'));
      })
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching product:', error);
        return throwError(() => new Error('Failed to fetch product'));
      })
    );
  }

  addProduct(product: Partial<Product>): Observable<any> {
    return this.http.post(this.apiUrl, product, { headers: this.getHeaders() }).pipe(
      tap(() => this.cachedItems = null),
      catchError(error => {
        console.error('Error adding product:', error);
        return throwError(() => new Error('Failed to add product'));
      })
    );
  }
}
