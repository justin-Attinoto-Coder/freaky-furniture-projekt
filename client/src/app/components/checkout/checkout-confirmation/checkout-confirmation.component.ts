import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBoxOpen, faCreditCard, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-checkout-confirmation',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './checkout-confirmation.component.html',
  styleUrls: ['./checkout-confirmation.component.css']
})
export class CheckoutConfirmationComponent implements OnInit {
  customerDetails: any = {};
  shippingDetails: any = {};
  paymentDetails: any = {};
  orderSummary: any = {};

  // FontAwesome icons for progress bar
  faBoxOpen = faBoxOpen;
  faCreditCard = faCreditCard;
  faClipboardCheck = faClipboardCheck;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      const state = history.state;
      this.customerDetails = state.customerDetails || {};
      this.shippingDetails = state.shippingDetails || {};
      this.paymentDetails = state.paymentDetails || {};
      this.orderSummary = state.orderSummary || {};
      console.log('Checkout-Confirmation: Received state:', {
        customerDetails: this.customerDetails,
        shippingDetails: this.shippingDetails,
        paymentDetails: this.paymentDetails,
        orderSummary: this.orderSummary
      });
    });
  }

  goToHome() {
    console.log('Checkout-Confirmation: Navigating to home');
    this.router.navigate(['/home']);
  }
}