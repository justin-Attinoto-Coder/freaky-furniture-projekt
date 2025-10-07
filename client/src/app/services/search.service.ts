import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

interface ProductResponse {
  products: Product[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = `${environment.apiBaseUrl}/api/products`;
  private searchResults = new BehaviorSubject<Product[]>([]);
  private searchPerformed = new BehaviorSubject<boolean>(false);
  private searchQuery = new BehaviorSubject<string>('');

  searchResults$ = this.searchResults.asObservable();
  searchPerformed$ = this.searchPerformed.asObservable();
  searchQuery$ = this.searchQuery.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  search(query: string): void {
    console.log('SearchService: Searching for:', query);
    const normalizedQuery = query.toLowerCase().trim();
    this.searchQuery.next(query);

    if (!normalizedQuery) {
      this.searchResults.next([]);
      this.searchPerformed.next(false);
      return;
    }

    this.http.get<ProductResponse>(`${this.apiUrl}?query=${encodeURIComponent(normalizedQuery)}`, {
      headers: this.getHeaders()
    }).subscribe({
      next: (response) => {
        console.log('SearchService: Search results:', response);
        // Extract products array from response
        const products = response.products || [];
        this.searchResults.next(products);
        this.searchPerformed.next(true);
      },
      error: (error) => {
        console.error('SearchService: Error searching:', error);
        this.searchResults.next([]);
        this.searchPerformed.next(true);
      }
    });
  }

  clearSearch(): void {
    console.log('SearchService: Clearing search');
    this.searchResults.next([]);
    this.searchPerformed.next(false);
    this.searchQuery.next('');
  }
}
