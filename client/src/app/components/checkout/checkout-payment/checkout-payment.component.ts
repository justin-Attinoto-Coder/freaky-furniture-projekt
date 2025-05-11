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
  totalPrice: number = 0;
  error: string | null = null;

  // FontAwesome icons for progress bar
  faBoxOpen = faBoxOpen;
  faCreditCard = faCreditCard;
  faClipboardCheck = faClipboardCheck;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {
    this.route.paramMap.subscribe(() => {
      const state = history.state;
      this.customerDetails = state.customerDetails || {};
      this.shippingDetails = state.shippingDetails || {};
      this.cartItems = state.cartItems || [];
      this.totalPrice = state.totalPrice || 0;
      this.error = state.error || null;
      console.log('Checkout-Payment: Received state:', { customerDetails: this.customerDetails, shippingDetails: this.shippingDetails, cartItems: this.cartItems, totalPrice: this.totalPrice, error: this.error });
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
            totalPrice: this.totalPrice
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
        totalPrice: this.totalPrice
      }
    });
  }
}
