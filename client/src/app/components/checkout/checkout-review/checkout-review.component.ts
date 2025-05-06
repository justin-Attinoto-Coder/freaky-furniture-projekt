import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CheckoutReviewProgressBarComponent } from '../checkout-review-progress-bar/checkout-review-progress-bar.component';
import { ReviewProductCardComponent } from '../review-product-card/review-product-card.component';
import { OrderSummaryComponent } from '../../common/order-summary/order-summary.component';

@Component({
  selector: 'app-checkout-review',
  standalone: true,
  imports: [CommonModule, CheckoutReviewProgressBarComponent, ReviewProductCardComponent, OrderSummaryComponent],
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.css']
})
export class CheckoutReviewComponent implements OnInit {
  @Input() clearCartAfterCheckout?: () => void;
  cartItems: any[] = [];
  shippingMethod: string = 'home';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchCartItems();
  }

  fetchCartItems() {
    this.http.get('http://localhost:8000/api/cart').subscribe({
      next: (data: any) => this.cartItems = data,
      error: (error) => console.error('Error fetching cart items:', error)
    });
  }

  get subtotal() {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  get shippingFee() {
    return this.shippingMethod === 'home' ? 10 : this.shippingMethod === 'servicePoint' ? 0 : 25;
  }

  get grandTotal() {
    return this.subtotal + this.shippingFee;
  }

  handleQuantityChange(id: number, newQuantity: number) {
    this.cartItems = this.cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(newQuantity, 1) } : item
    );
  }

  handleConfirmOrder() {
    this.http.delete('http://localhost:8000/api/cart/clear').subscribe({
      next: () => {
        console.log('Cart cleared in the backend');
        if (this.clearCartAfterCheckout) {
          this.clearCartAfterCheckout();
        } else {
          this.cartItems = [];
        }
        this.router.navigate(['/checkout-confirmation']);
      },
      error: (error) => console.error('Error clearing cart:', error)
    });
  }
}
