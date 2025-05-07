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
      console.log('Cart items updated:', items);
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
        console.log('Recommended items:', this.recommendedItems);
      },
      error: (error: any) => console.error('Error fetching recommended items:', error)
    });
  }

  handleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const { name, value } = target;
    this.formData = { ...this.formData, [name]: value };
    console.log('Form data updated:', this.formData);
  }

  updateCartItem(event: { productId: number; quantity: number }): void {
    this.cartService.updateCartItem(event.productId, event.quantity).subscribe({
      next: () => console.log('Cart item update successful'),
      error: (error: any) => console.error('Error updating cart item:', error)
    });
  }

  deleteCartItem(productId: number): void {
    this.cartService.deleteCartItem(productId).subscribe({
      next: () => console.log('Cart item deletion successful'),
      error: (error: any) => console.error('Error deleting cart item:', error)
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total: number, item: CartItem) => total + (item.price || 0) * item.quantity, 0);
  }

  handleCheckout(event: Event): void {
    event.preventDefault();
    const isFormValid = Object.values(this.formData).every((field: string) => field.trim() !== '');
    if (!isFormValid) {
      this.error = 'Please fill out all fields.';
      console.log('Form validation failed:', this.formData);
      return;
    }
    this.error = null;
    this.success = false;

    this.cartService.addCustomer(this.formData).subscribe({
      next: () => {
        this.success = true;
        const totalPrice = this.getTotalPrice();
        console.log('Checkout successful, navigating to /checkout-shipping:', { formData: this.formData, cartItems: this.cartItems, totalPrice });
        this.router.navigate(['/checkout-shipping'], {
          state: {
            customerDetails: this.formData,
            cartItems: this.cartItems,
            totalPrice
          }
        });
      },
      error: (error: any) => {
        this.error = 'Failed to proceed to shipping. Please try again.';
        console.error('Checkout error:', error);
      }
    });
  }

  navigateToHome(): void {
    console.log('Navigating to home');
    this.router.navigate(['/']);
  }
}
