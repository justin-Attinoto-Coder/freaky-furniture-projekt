import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
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
  cartItems: any[] = [];
  shippingMethod: string = 'home';
  customerDetails: any = {};
  shippingDetails: any = {};
  paymentDetails: any = {};
  totalPrice: number = 0;
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(() => {
      const state = history.state;
      this.customerDetails = state.customerDetails || {};
      this.shippingDetails = state.shippingDetails || {};
      this.paymentDetails = state.paymentDetails || {};
      this.cartItems = state.cartItems || [];
      this.totalPrice = state.totalPrice || 0;
      this.error = state.error || null;
      console.log('Checkout-Review: Received state:', { customerDetails: this.customerDetails, shippingDetails: this.shippingDetails, paymentDetails: this.paymentDetails, cartItems: this.cartItems, totalPrice: this.totalPrice, error: this.error });
    });
  }

  ngOnInit() {
    this.fetchCartItems();
  }

  fetchCartItems() {
    this.http.get('http://localhost:8000/api/cart').subscribe({
      next: (data: any) => {
        this.cartItems = data;
        console.log('Checkout-Review: Fetched cart items:', this.cartItems);
      },
      error: (error) => console.error('Checkout-Review: Error fetching cart items:', error)
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
    console.log('Checkout-Review: Updated cart item quantity:', this.cartItems);
  }

  handleConfirmOrder() {
    console.log('Checkout-Review: Confirming order, clearing cart');
    this.http.delete('http://localhost:8000/api/cart/clear').subscribe({
      next: () => {
        console.log('Checkout-Review: Cart cleared in the backend');
        this.cartItems = [];
        this.router.navigate(['/checkout-confirmation'], {
          state: {
            customerDetails: this.customerDetails,
            shippingDetails: this.shippingDetails,
            paymentDetails: this.paymentDetails,
            cartItems: this.cartItems,
            totalPrice: this.totalPrice,
            orderSummary: {
              subtotal: this.subtotal,
              shippingFee: this.shippingFee,
              grandTotal: this.grandTotal
            }
          }
        }).then(success => {
          console.log('Checkout-Review: Navigation to /checkout-confirmation successful:', success);
        }).catch(error => {
          console.error('Checkout-Review: Navigation to /checkout-confirmation failed:', error);
          this.error = 'Failed to navigate to confirmation. Please try again.';
        });
      },
      error: (error) => {
        console.error('Checkout-Review: Error clearing cart:', error);
        this.error = 'Failed to clear cart. Please try again.';
      }
    });
  }
}
