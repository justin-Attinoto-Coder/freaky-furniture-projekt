import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface CartItem {
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
        console.log('Loaded cart items:', items);
        this.cartItemsSubject.next(items);
      },
      error: (error: HttpErrorResponse) => console.error('Error loading cart items:', error)
    });
  }

  addCartItem(item: CartItem): Observable<{ id: number }> {
    return this.http.post<{ id: number }>('http://localhost:8000/api/cart', item).pipe(
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
    return this.http.delete<void>(`http://localhost:8000/api/cart/${productId}`).pipe(
      tap(() => {
        console.log('Deleted cart item:', productId);
        this.loadCartItems();
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting cart item:', error);
        return throwError(() => new Error('Failed to delete cart item'));
      })
    );
  }

  addCustomer(customerData: CustomerData): Observable<any> {
    return this.http.post('http://localhost:8000/api/customers', customerData).pipe(
      tap(() => console.log('Customer added:', customerData)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error adding customer:', error);
        return throwError(() => new Error('Failed to add customer'));
      })
    );
  }
}
