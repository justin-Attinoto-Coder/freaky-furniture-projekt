import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MyBasketComponent } from './my-basket/my-basket.component';
import { CartCustomerFormComponent } from './cart-customer-form/cart-customer-form.component';
import { MaybeYouAlsoLikeComponent } from './maybe-you-also-like/maybe-you-also-like.component';
import { CartService, CartItem, CustomerData } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, MyBasketComponent, CartCustomerFormComponent, MaybeYouAlsoLikeComponent]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  recommendedItems: Product[] = [];
  formData: CustomerData = {
    fullName: '',
    phoneNumber: '',
    province: '',
    city: '',
    streetAddress: '',
    postalCode: ''
  };
  error: string | null = null;
  success = false;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
    // Fetch recommended items from ProductService or API
    this.productService.getProducts('recommended').subscribe({
      next: (items) => this.recommendedItems = items.slice(0, 4),
      error: (error) => console.error('Error fetching recommended items:', error)
    });
  }

  handleChange(event: Event): void {
    const { name, value } = event.target as HTMLInputElement;
    this.formData = { ...this.formData, [name]: value }; // Fixed: use formData
  }

  updateCartItem(productId: number, quantity: number): void {
    this.cartService.updateCartItem(productId, quantity);
  }

  deleteCartItem(productId: number): void {
    this.cartService.deleteCartItem(productId);
  }

  handleCheckout(event: Event): void {
    event.preventDefault();
    const isFormValid = Object.values(this.formData).every(field => field.trim() !== '');
    if (!isFormValid) {
      this.error = 'Please fill out all fields.';
      return;
    }
    this.error = null;
    this.success = false;

    this.cartService.addCustomer(this.formData).subscribe({
      next: () => {
        this.success = true;
        const totalPrice = this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        this.router.navigate(['/checkout-shipping'], {
          state: {
            customerDetails: this.formData,
            cartItems: this.cartItems,
            totalPrice
          }
        });
      },
      error: () => {
        this.error = 'Failed to proceed to shipping. Please try again.';
      }
    });
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
