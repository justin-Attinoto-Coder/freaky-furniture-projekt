import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'https://freaky-angular-furniture-backend.onrender.com/api/furniture';
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
    this.searchQuery.next(query);
    if (!query.trim()) {
      this.searchResults.next([]);
      this.searchPerformed.next(false);
      return;
      }
      this.http.get<Product[]>(`${this.apiUrl}?query=${encodeURIComponent(query)}`, { headers: this.getHeaders() }).subscribe({
        next: (results) => {
          console.log('SearchService: Search results:', results);
          this.searchResults.next(results || []);
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
