import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBoxOpen, faCreditCard, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { ReviewProductCardComponent } from '../review-product-card/review-product-card.component';
import { OrderSummaryComponent } from '../../common/order-summary/order-summary.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-checkout-review',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ReviewProductCardComponent, OrderSummaryComponent],
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.css']
})
export class CheckoutReviewComponent implements OnInit {
  cartItems: any[] = [];
  customerDetails: any = {};
  shippingDetails: any = {};
  paymentDetails: any = {};
  totalPrice: number = 0;
  subtotalFromState: number = 0;
  shippingFeeFromState: number = 0;
  error: string | null = null;

  // FontAwesome icons for progress bar
  faBoxOpen = faBoxOpen;
  faCreditCard = faCreditCard;
  faClipboardCheck = faClipboardCheck;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(() => {
      const state = history.state;
      this.customerDetails = state.customerDetails || {};
      this.shippingDetails = state.shippingDetails || {};
      this.paymentDetails = state.paymentDetails || {};
      this.cartItems = state.cartItems || [];
      this.totalPrice = state.totalPrice || 0;
      this.subtotalFromState = state.subtotal || 0;
      this.shippingFeeFromState = state.shippingFee || 0;
      this.error = state.error || null;
      console.log('Checkout-Review: Received state:', {
        customerDetails: this.customerDetails,
        shippingDetails: this.shippingDetails,
        paymentDetails: this.paymentDetails,
        cartItems: this.cartItems,
        totalPrice: this.totalPrice,
        subtotal: this.subtotalFromState,
        shippingFee: this.shippingFeeFromState,
        error: this.error
      });
    });
  }

  ngOnInit() {
    if (!this.cartItems.length) {
      this.fetchCartItems();
    }
  }

  fetchCartItems() {
    this.http.get(`${environment.apiBaseUrl}/api/cart`).subscribe({
      next: (data: any) => {
        this.cartItems = data.map((item: any) => ({
          ...item,
          imageURL: item.imageURL || '/images/default.jpg' // Ensure imageURL exists
        }));
        console.log('Checkout-Review: Fetched cart items:', this.cartItems);
      },
      error: (error) => console.error('Checkout-Review: Error fetching cart items:', error)
    });
  }

  get subtotal() {
    // Calculate from cart items for live updates when quantity changes
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  get shippingFee() {
    // Use the shipping fee passed from payment page (based on selected carrier)
    return this.shippingFeeFromState;
  }

  get grandTotal() {
    return this.subtotal + this.shippingFee;
  }

  handleQuantityChange(productId: number, newQuantity: number) {
    const quantity = Math.max(newQuantity, 1); // Ensure quantity is at least 1
    const item = this.cartItems.find(item => item.productId === productId);
    if (!item) {
      console.error('Checkout-Review: Item not found for productId:', productId);
      this.error = 'Item not found. Please try again.';
      return;
    }

    console.log('Checkout-Review: Updating quantity for productId:', productId, 'to:', quantity);

    // Update UI optimistically first
    this.cartItems = this.cartItems.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    console.log('Checkout-Review: Updated cart items locally:', this.cartItems);
    console.log('Checkout-Review: New totals - Subtotal:', this.subtotal, 'Shipping:', this.shippingFee, 'Grand Total:', this.grandTotal);

    // Try to update in the backend (but don't fail if item not in cart)
    // Only send quantity as the API expects UpdateCartItemRequest with just quantity
    this.http.put(`${environment.apiBaseUrl}/api/cart/${productId}`, {
      quantity
    }).subscribe({
      next: () => {
        console.log('Checkout-Review: Cart item updated in database');
        this.error = null;
      },
      error: (error) => {
        // Log the error but don't revert changes - we're in checkout flow
        console.warn('Checkout-Review: Could not update cart in database (items may have been cleared):', {
          status: error.status,
          message: error.message
        });
        // Keep the local changes - user is in active checkout
        this.error = null;
      }
    });
  }

  handleConfirmOrder() {
    console.log('Checkout-Review: Confirming order, clearing cart');
    this.http.delete(`${environment.apiBaseUrl}/api/cart/clear`).subscribe({
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

  navigateToPayment() {
    console.log('Checkout-Review: Navigating to checkout-payment');
    this.router.navigate(['/checkout-payment'], {
      state: {
        customerDetails: this.customerDetails,
        shippingDetails: this.shippingDetails,
        paymentDetails: this.paymentDetails,
        cartItems: this.cartItems,
        totalPrice: this.totalPrice
      }
    });
  }
}
