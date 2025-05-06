import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Added import
import { Product } from '../models/product';
import { AuthService } from './auth.service';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageURL: string;
  brand?: string;
  urlSlug: string;
}

export interface CustomerData {
  fullName: string;
  phoneNumber: string;
  province: string;
  city: string;
  streetAddress: string;
  postalCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();
  private apiUrl = 'http://localhost:8000/api/cart';

  constructor(private http: HttpClient, private authService: AuthService) {
    this.fetchCartItems();
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private fetchCartItems(): void {
    this.http.get<CartItem[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe(items => {
      this.cartItems.next(items);
    });
  }

  addToCart(item: CartItem): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.apiUrl, item, { headers: this.getHeaders() }).pipe(
      tap(() => this.fetchCartItems())
    );
  }

  updateCartItem(productId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${productId}`, { quantity }, { headers: this.getHeaders() }).pipe(
      tap(() => this.fetchCartItems())
    );
  }

  deleteCartItem(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`, { headers: this.getHeaders() }).pipe(
      tap(() => this.fetchCartItems())
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`, { headers: this.getHeaders() }).pipe(
      tap(() => this.cartItems.next([]))
    );
  }

  addCustomer(customerData: CustomerData): Observable<any> {
    return this.http.post('http://localhost:8000/api/customers', customerData, { headers: this.getHeaders() });
  }
}
