import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart, faCheckCircle, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-checkout-confirmation',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './checkout-confirmation.component.html',
  styleUrls: ['./checkout-confirmation.component.css']
})
export class CheckoutConfirmationComponent {
  @Input() customerName: string = 'Customer';
  @Input() shippingAddress: string = 'N/A';
  @Input() billingAddress: string = 'N/A';
  @Input() shippingMethod: string = 'Standard Shipping';
  @Input() paymentMethod: string = 'Credit Card';
  @Input() orderSummary: { subtotal: number; shippingFee: number; grandTotal: number } = {
    subtotal: 0,
    shippingFee: 0,
    grandTotal: 0
  };

  faShoppingCart = faShoppingCart;
  faCheckCircle = faCheckCircle;
  faThumbsUp = faThumbsUp;

  constructor(private router: Router) {}

  handleContinueShopping() {
    this.router.navigate(['/']);
  }
}
