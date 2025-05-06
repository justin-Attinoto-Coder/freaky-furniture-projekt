import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CheckoutHeaderComponent } from '../../common/checkout-header/checkout-header.component';
import { ProgressBarComponent } from '../../common/progress-bar/progress-bar.component';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { OrderSummaryComponent } from '../../common/order-summary/order-summary.component';

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckoutHeaderComponent, ProgressBarComponent, PaymentFormComponent, OrderSummaryComponent],
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

  shippingDetails = {
    streetAddress: '123 Main Street',
    city: 'Springfield',
    postalCode: '12345',
    carrier: 'FedEx',
    shippingMethod: 'Express Delivery'
  };

  constructor(private router: Router) {}

  handleChange(event: Event) {
    const { name, value, type, checked } = event.target as HTMLInputElement;
    this.paymentDetails = {
      ...this.paymentDetails,
      [name]: type === 'checkbox' ? checked : value
    };
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    console.log('Sending payment data:', this.paymentDetails);
    this.router.navigate(['/checkout-review']);
  }
}
