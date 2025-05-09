import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart, faCheckCircle, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-checkout-confirmation',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './checkout-confirmation.component.html',
  styleUrls: ['./checkout-confirmation.component.css']
})
export class CheckoutConfirmationComponent implements OnInit {
  customerName: string = 'Customer';
  shippingAddress: string = 'N/A';
  billingAddress: string = 'N/A';
  shippingMethod: string = 'Standard Shipping';
  paymentMethod: string = 'Credit Card';
  orderSummary: { subtotal: number; shippingFee: number; grandTotal: number } = {
    subtotal: 0,
    shippingFee: 0,
    grandTotal: 0
  };

  faShoppingCart = faShoppingCart;
  faCheckCircle = faCheckCircle;
  faThumbsUp = faThumbsUp;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(() => {
      const state = history.state;
      this.customerName = state.customerDetails?.fullName || 'Customer';
      this.shippingAddress = `${state.shippingDetails?.streetAddress || ''}, ${state.shippingDetails?.city || ''}, ${state.shippingDetails?.postalCode || ''}`;
      this.billingAddress = state.paymentDetails?.billingAddress === 'same' ? this.shippingAddress : 'N/A';
      this.shippingMethod = state.shippingDetails?.shippingMethod || 'Standard Shipping';
      this.paymentMethod = state.paymentDetails?.paymentMethod || 'Credit Card';
      this.orderSummary = state.orderSummary || { subtotal: 0, shippingFee: 0, grandTotal: 0 };
      console.log('Checkout-Confirmation: Received state:', state);
    });
  }

  ngOnInit() {
    console.log('Checkout-Confirmation: Initialized with:', {
      customerName: this.customerName,
      shippingAddress: this.shippingAddress,
      billingAddress: this.billingAddress,
      shippingMethod: this.shippingMethod,
      paymentMethod: this.paymentMethod,
      orderSummary: this.orderSummary
    });
  }

  handleContinueShopping() {
    console.log('Checkout-Confirmation: Navigating to home');
    this.router.navigate(['/']).then(success => {
      console.log('Checkout-Confirmation: Navigation to home successful:', success);
    }).catch(error => {
      console.error('Checkout-Confirmation: Navigation to home failed:', error);
    });
  }
}
