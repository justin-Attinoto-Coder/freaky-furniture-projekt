import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBoxOpen, faCreditCard, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { OrderSummaryComponent } from '../../common/order-summary/order-summary.component';

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, PaymentFormComponent, OrderSummaryComponent],
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.css']
})
export class CheckoutPaymentComponent {
  paymentDetails = {
    paymentMethod: 'creditCard',
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: 'same',
    rememberMe: false
  };

  customerDetails: any = {};
  shippingDetails: any = {};
  cartItems: any[] = [];
  subtotal: number = 0;
  shippingFee: number = 0;
  grandTotal: number = 0;
  error: string | null = null;

  // FontAwesome icons for progress bar
  faBoxOpen = faBoxOpen;
  faCreditCard = faCreditCard;
  faClipboardCheck = faClipboardCheck;

  // Shipping fee mapping
  shippingFees: { [key: string]: number } = {
    "DHL Express": 149,
    "EarlyBird": 99,
    "AirMe": 89,
    "DHL": 69,
    "Schenker Parcel": 59,
    "InstaBox": 49,
    "PostNord": 39
  };

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {
    this.route.paramMap.subscribe(() => {
      const state = history.state;
      this.customerDetails = state.customerDetails || {};
      this.shippingDetails = state.shippingDetails || {};
      this.cartItems = state.cartItems || [];
      this.subtotal = state.totalPrice || 0;
      this.error = state.error || null;

      console.log('Checkout-Payment: Received state:', {
        customerDetails: this.customerDetails,
        shippingDetails: this.shippingDetails,
        cartItems: this.cartItems,
        subtotal: this.subtotal,
        error: this.error
      });

      // Calculate shipping fee based on carrier
      if (this.shippingDetails.carrier) {
        this.shippingFee = this.shippingFees[this.shippingDetails.carrier] || 0;
        console.log(`Checkout-Payment: Shipping fee for ${this.shippingDetails.carrier}: ${this.shippingFee} SEK`);
      }

      // Calculate cart subtotal from items if totalPrice is 0
      if (this.subtotal === 0 && this.cartItems.length > 0) {
        this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        console.log('Checkout-Payment: Calculated subtotal from cart items:', this.subtotal);
      }

      // Calculate grand total
      this.grandTotal = this.subtotal + this.shippingFee;
      console.log('Checkout-Payment: Order summary - Subtotal:', this.subtotal, 'Shipping:', this.shippingFee, 'Grand Total:', this.grandTotal);
    });
  }

  handleChange(event: Event) {
    const { name, value, type, checked } = event.target as HTMLInputElement;
    this.paymentDetails = {
      ...this.paymentDetails,
      [name]: type === 'checkbox' ? checked : value
    };
    console.log('Checkout-Payment: Payment details updated:', this.paymentDetails);
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    console.log('Checkout-Payment: Submitting payment details:', this.paymentDetails);
    if (!this.paymentDetails.cardHolderName || !this.paymentDetails.cardNumber || !this.paymentDetails.expiryDate || !this.paymentDetails.cvv) {
      this.error = 'Please fill out all payment fields.';
      console.error('Checkout-Payment: Form validation failed:', this.paymentDetails);
      return;
    }
    this.http.post('https://freaky-angular-furniture-backend.onrender.com/api/payment-details', this.paymentDetails).subscribe({
      next: (response) => {
        console.log('Checkout-Payment: Payment details saved, response:', response);
        this.error = null;
        this.router.navigate(['/checkout-review'], {
          state: {
            customerDetails: this.customerDetails,
            shippingDetails: this.shippingDetails,
            paymentDetails: this.paymentDetails,
            cartItems: this.cartItems,
            subtotal: this.subtotal,
            shippingFee: this.shippingFee,
            totalPrice: this.grandTotal
          }
        }).then(success => {
          console.log('Checkout-Payment: Navigation to /checkout-review successful:', success);
        }).catch(error => {
          console.error('Checkout-Payment: Navigation to /checkout-review failed:', error);
          this.error = 'Failed to navigate to review. Please try again.';
        });
      },
      error: (error) => {
        console.error('Checkout-Payment: Error saving payment details:', error);
        this.error = 'Failed to save payment details. Please try again.';
      }
    });
  }

  navigateToShipping() {
    console.log('Checkout-Payment: Navigating to checkout-shipping');
    this.router.navigate(['/checkout-shipping'], {
      state: {
        customerDetails: this.customerDetails,
        shippingDetails: this.shippingDetails,
        cartItems: this.cartItems,
        totalPrice: this.subtotal
      }
    });
  }
}
