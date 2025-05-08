import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MyBasketComponent } from './my-basket/my-basket.component';
import { CartCustomerFormComponent } from './cart-customer-form/cart-customer-form.component';
import { MaybeYouAlsoLikeComponent } from './maybe-you-also-like/maybe-you-also-like.component';
import { CartService, CartItem, CustomerData } from '../../services/cart.service';
import { ProductService, Product } from '../../services/product.service';

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
    this.cartService.cartItems$.subscribe((items: CartItem[]) => {
      console.log('Cart: Cart items updated:', items);
      this.cartItems = items;
    });
    this.productService.getProducts().subscribe({
      next: (items: Product[]) => {
        this.recommendedItems = items
          .sort(() => 0.5 - Math.random())
          .slice(0, 4)
          .map(item => ({
            ...item,
            imageURL: `/images/${item.image}`
          }));
        console.log('Cart: Recommended items:', this.recommendedItems);
      },
      error: (error: any) => console.error('Cart: Error fetching recommended items:', error)
    });
  }

  handleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const { name, value } = target;
    this.formData = { ...this.formData, [name]: value };
    console.log('Cart: Form data updated:', this.formData);
  }

  updateCartItem(event: { productId: number; quantity: number }): void {
    this.cartService.updateCartItem(event.productId, event.quantity).subscribe({
      next: () => console.log('Cart: Cart item update successful'),
      error: (error: any) => console.error('Cart: Error updating cart item:', error)
    });
  }

  deleteCartItem(productId: number): void {
    console.log('Cart: Attempting to delete cart item with productId:', productId);
    this.cartService.deleteCartItem(productId).subscribe({
      next: () => {
        console.log('Cart: Cart item deletion successful for productId:', productId);
      },
      error: (error: any) => {
        console.error('Cart: Error deleting cart item:', error);
        this.error = 'Failed to delete cart item. Please try again.';
      }
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total: number, item: CartItem) => total + (item.price || 0) * item.quantity, 0);
  }

  handleCheckout(event: Event): void {
    event.preventDefault();
    console.log('Cart: Form submitted, attempting checkout with formData:', this.formData);
    const isFormValid = Object.values(this.formData).every((field: string) => field.trim().length > 0);
    if (!isFormValid) {
      this.error = 'Please fill out all fields.';
      console.log('Cart: Form validation failed:', this.formData);
      return;
    }
    if (this.cartItems.length === 0) {
      this.error = 'Your cart is empty. Add items before checking out.';
      console.log('Cart: Checkout failed: Empty cart');
      return;
    }
    this.error = null;
    this.success = false;

    console.log('Cart: Sending customer data to backend:', this.formData);
    this.cartService.addCustomer(this.formData).subscribe({
      next: (response) => {
        this.success = true;
        const totalPrice = this.getTotalPrice();
        console.log('Cart: Customer data saved, response:', response);
        console.log('Cart: Navigating to /checkout-shipping with state:', { customerDetails: this.formData, cartItems: this.cartItems, totalPrice });
        this.router.navigate(['/checkout-shipping'], {
          state: {
            customerDetails: this.formData,
            cartItems: this.cartItems,
            totalPrice
          }
        }).then(success => {
          console.log('Cart: Navigation to /checkout-shipping successful:', success);
        }).catch(error => {
          console.error('Cart: Navigation to /checkout-shipping failed:', error);
          this.error = 'Failed to navigate to checkout. Please try again.';
        });
      },
      error: (error: any) => {
        this.error = 'Failed to save customer data. Please try again.';
        console.error('Cart: Checkout error:', error);
      },
      complete: () => console.log('Cart: addCustomer request completed')
    });
  }

  navigateToHome(): void {
    console.log('Cart: Navigating to home');
    this.router.navigate(['/']);
  }
}
