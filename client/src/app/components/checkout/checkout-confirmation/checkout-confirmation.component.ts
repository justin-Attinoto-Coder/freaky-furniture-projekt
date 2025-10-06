import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartService } from '../../../services/cart.service';
import {
  faCheckCircle,
  faTruck,
  faBox,
  faMapMarkerAlt,
  faCreditCard,
  faEnvelope,
  faPhone,
  faHome,
  faCalendarAlt,
  faClock,
  faUser,
  faShippingFast
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-checkout-confirmation',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './checkout-confirmation.component.html',
  styleUrls: ['./checkout-confirmation.component.css']
})
export class CheckoutConfirmationComponent implements OnInit {
  // FontAwesome icons
  faCheckCircle = faCheckCircle;
  faTruck = faTruck;
  faBox = faBox;
  faMapMarkerAlt = faMapMarkerAlt;
  faCreditCard = faCreditCard;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faHome = faHome;
  faCalendarAlt = faCalendarAlt;
  faClock = faClock;
  faUser = faUser;
  faShippingFast = faShippingFast;

  // Order data
  orderNumber: string = '';
  orderDate: Date = new Date();
  estimatedDelivery: Date = new Date();
  customerDetails: any = {};
  shippingDetails: any = {};
  paymentDetails: any = {};
  cartItems: any[] = [];
  orderSummary: any = {};

  // UI state
  showConfetti: boolean = true;
  imageBaseUrl: string = 'http://localhost:5186';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Refresh cart to reflect that it's been cleared (cart was cleared on order confirmation)
    // This ensures the header cart icon shows 0 items immediately
    this.cartService.refreshCart();
    console.log('Checkout-Confirmation: Cart refreshed - should now show as empty');

    // Receive order data from router state
    const state = history.state;
    this.customerDetails = state.customerDetails || {};
    this.shippingDetails = state.shippingDetails || {};
    this.paymentDetails = state.paymentDetails || {};
    this.cartItems = state.cartItems || [];
    this.orderSummary = state.orderSummary || {
      subtotal: 0,
      shippingFee: 0,
      grandTotal: 0
    };

    // Generate order number (in real app, this would come from backend)
    this.orderNumber = this.generateOrderNumber();

    // Calculate estimated delivery (add delivery time to current date)
    this.calculateEstimatedDelivery();

    // Hide confetti after 5 seconds
    setTimeout(() => {
      this.showConfetti = false;
    }, 5000);

    console.log('Checkout-Confirmation: Order completed!', {
      orderNumber: this.orderNumber,
      customer: this.customerDetails,
      shipping: this.shippingDetails,
      items: this.cartItems,
      summary: this.orderSummary
    });
  }

  generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FF-${timestamp}-${random}`;
  }

  calculateEstimatedDelivery(): void {
    const daysToAdd = this.getDeliveryDays();
    this.estimatedDelivery = new Date();
    this.estimatedDelivery.setDate(this.estimatedDelivery.getDate() + daysToAdd);
  }

  getDeliveryDays(): number {
    // Map carrier to estimated delivery days
    const deliveryDays: { [key: string]: number } = {
      "DHL Express": 1,
      "EarlyBird": 1,
      "AirMe": 2,
      "DHL": 3,
      "Schenker Parcel": 4,
      "InstaBox": 3,
      "PostNord": 5
    };
    return deliveryDays[this.shippingDetails.carrier] || 5;
  }

  getImageUrl(imageURL: string): string {
    if (!imageURL) return 'https://via.placeholder.com/80?text=No+Image';
    return imageURL.startsWith('http') ? imageURL : `${this.imageBaseUrl}${imageURL}`;
  }

  getMaskedCardNumber(): string {
    if (!this.paymentDetails.cardNumber) return '•••• •••• •••• ••••';
    const last4 = this.paymentDetails.cardNumber.slice(-4);
    return `•••• •••• •••• ${last4}`;
  }

  goToHome() {
    console.log('Checkout-Confirmation: Navigating to home');
    this.router.navigate(['/']);
  }

  goToOrders() {
    console.log('Checkout-Confirmation: Navigating to orders');
    // In a real app, navigate to order history page
    this.router.navigate(['/']);
  }
}
