import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface CartItem {
  id?: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageURL: string;
  brand: string;
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
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartItems();
  }

  private loadCartItems(): void {
    this.http.get<CartItem[]>('http://localhost:8000/api/cart').subscribe({
      next: (items) => {
        const normalizedItems = items.map(item => ({
          ...item,
          imageURL: item.imageURL.replace(/\\/g, '/').replace(/^\/+/, '/')
        }));
        console.log('Loaded cart items:', normalizedItems);
        this.cartItemsSubject.next(normalizedItems);
      },
      error: (error: HttpErrorResponse) => console.error('Error loading cart items:', error)
    });
  }

  addCartItem(item: CartItem): Observable<{ id: number }> {
    return this.http.post<{ id: number }>('http://localhost:8000/api/cart', {
      ...item,
      imageURL: item.imageURL.replace(/\\/g, '/').replace(/^\/+/, '/')
    }).pipe(
      tap((response) => {
        console.log('Added cart item:', item, 'Response:', response);
        this.loadCartItems();
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error adding cart item:', error);
        return throwError(() => new Error('Failed to add cart item'));
      })
    );
  }

  updateCartItem(productId: number, quantity: number): Observable<void> {
    return this.http.put<void>(`http://localhost:8000/api/cart/${productId}`, { quantity }).pipe(
      tap(() => {
        console.log('Updated cart item:', { productId, quantity });
        this.loadCartItems();
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating cart item:', error);
        return throwError(() => new Error('Failed to update cart item'));
      })
    );
  }

  deleteCartItem(productId: number): Observable<void> {
    console.log('Sending DELETE request for cart item productId:', productId);
    return this.http.delete<void>(`http://localhost:8000/api/cart/${productId}`).pipe(
      tap(() => {
        console.log('Deleted cart item with productId:', productId);
        this.loadCartItems();
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting cart item:', error, 'Status:', error.status, 'Message:', error.message);
        return throwError(() => new Error('Failed to delete cart item'));
      })
    );
  }

  addCustomer(customerData: CustomerData): Observable<any> {
    console.log('POST /api/customers with data:', customerData);
    return this.http.post('http://localhost:8000/api/customers', customerData).pipe(
      tap((response) => console.log('Customer added, response:', response)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error adding customer:', error, 'Status:', error.status, 'Message:', error.message);
        return throwError(() => new Error(`Failed to add customer: ${error.message}`));
      })
    );
  }
}
