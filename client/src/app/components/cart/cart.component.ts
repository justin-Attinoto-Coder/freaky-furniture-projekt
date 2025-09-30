import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItems = items;
        this.calculateTotal();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  calculateTotal(): void {
    // Fix: Use item.price instead of item.product.price
    this.totalPrice = this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  updateQuantity(productId: number, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeFromCart(productId);
    } else {
      // Fix: Use updateCartItem method that exists
      this.cartService.updateCartItem(productId, newQuantity).subscribe({
        next: () => console.log('Cart updated'),
        error: (error) => console.error('Error updating cart:', error)
      });
    }
  }

  removeFromCart(productId: number): void {
    // Fix: Use deleteCartItem method that exists
    this.cartService.deleteCartItem(productId).subscribe({
      next: () => console.log('Item removed from cart'),
      error: (error) => console.error('Error removing item:', error)
    });
  }

  clearCart(): void {
    // Add this method to CartService if missing
    this.cartService.clearCart().subscribe({
      next: () => console.log('Cart cleared'),
      error: (error) => console.error('Error clearing cart:', error)
    });
  }

  proceedToCheckout(): void {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/checkout']);
    }
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }
}
