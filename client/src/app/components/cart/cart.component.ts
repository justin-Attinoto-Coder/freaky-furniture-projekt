import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MyBasketComponent } from './my-basket/my-basket.component';
import { MaybeYouAlsoLikeComponent } from './maybe-you-also-like/maybe-you-also-like.component';
import { CartService, CartItem } from '../../services/cart.service';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, MyBasketComponent, MaybeYouAlsoLikeComponent]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  recommendedItems: Product[] = [];
  error: string | null = null;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Cart: Initializing component');
    this.cartService.cartItems$.subscribe((items: CartItem[]) => {
      console.log('Cart: Cart items updated:', items);
      this.cartItems = items;
    });
    this.productService.getProducts().subscribe({
      next: (items: Product[]) => {
        this.recommendedItems = items
          .sort(() => 0.5 - Math.random())
          .slice(0, 4)
          .map(item => ({
            ...item,
            imageURL: `/images/${item.image}`
          }));
        console.log('Cart: Recommended items:', this.recommendedItems);
      },
      error: (error: any) => console.error('Cart: Error fetching recommended items:', error)
    });
  }

  updateCartItem(event: { productId: number; quantity: number }): void {
    console.log('Cart: Updating cart item:', event);
    this.cartService.updateCartItem(event.productId, event.quantity).subscribe({
      next: () => console.log('Cart: Cart item update successful'),
      error: (error: any) => console.error('Cart: Error updating cart item:', error)
    });
  }

  deleteCartItem(productId: number): void {
    console.log('Cart: Attempting to delete cart item with productId:', productId);
    this.cartService.deleteCartItem(productId).subscribe({
      next: () => {
        console.log('Cart: Cart item deletion successful for productId:', productId);
      },
      error: (error: any) => {
        console.error('Cart: Error deleting cart item:', error);
        this.error = 'Failed to delete cart item. Please try again.';
      }
    });
  }

  getTotalPrice(): number {
    const total = this.cartItems.reduce((total: number, item: CartItem) => total + (item.price || 0) * item.quantity, 0);
    console.log('Cart: Calculated total price:', total);
    return total;
  }

  handleCheckout(event: Event): void {
    console.log('Cart: handleCheckout triggered via form submission');
    event.preventDefault();
    this.navigateToCheckoutShipping();
  }

  onPurchaseClick(): void {
    console.log('Cart: Purchase button clicked');
    this.navigateToCheckoutShipping();
  }

  private navigateToCheckoutShipping(): void {
    console.log('Cart: Navigating to checkout-shipping, cartItems:', this.cartItems);
    if (this.cartItems.length === 0) {
      this.error = 'Your cart is empty. Add items before checking out.';
      console.log('Cart: Checkout failed: Empty cart');
      return;
    }
    this.error = null;

    const totalPrice = this.getTotalPrice();
    console.log('Cart: Navigating to /checkout-shipping with state:', { cartItems: this.cartItems, totalPrice });
    this.router.navigate(['/checkout-shipping'], {
      state: {
        cartItems: this.cartItems,
        totalPrice
      }
    }).then(success => {
      console.log('Cart: Navigation to /checkout-shipping successful:', success);
    }).catch(error => {
      console.error('Cart: Navigation to /checkout-shipping failed:', error);
      this.error = 'Failed to navigate to checkout. Please try again.';
    });
  }

  navigateToHome(): void {
    console.log('Cart: Navigating to home');
    this.router.navigate(['/']);
  }
}