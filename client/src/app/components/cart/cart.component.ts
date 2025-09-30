import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService, CartItem, CustomerData } from '../../services/cart.service';
import { MyBasketComponent } from './my-basket/my-basket.component';
import { MaybeYouAlsoLikeComponent } from './maybe-you-also-like/maybe-you-also-like.component';
import { CartCustomerFormComponent } from './cart-customer-form/cart-customer-form.component';
import { Product } from '../../models/product';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MyBasketComponent,
    MaybeYouAlsoLikeComponent,
    CartCustomerFormComponent
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  recommendedItems: Product[] = [];
  totalPrice: number = 0;
  error: string = '';
  customerData: CustomerData = {
    fullName: '',
    phoneNumber: '',
    province: '',
    city: '',
    streetAddress: '',
    postalCode: ''
  };

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItems = items;
        this.calculateTotal();
      });

    // Load recommended items (mock for now)
    this.loadRecommendedItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Method that template expects
  deleteCartItem(productId: number): void {
    console.log('CartComponent: Deleting cart item with productId:', productId);
    this.cartService.deleteCartItem(productId).subscribe({
      next: () => {
        console.log('Item removed from cart');
        this.error = '';
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.error = 'Failed to remove item from cart';
      }
    });
  }

  // Method that template expects
  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  // Method that template expects
  onPurchaseClick(): void {
    if (this.cartItems.length > 0) {
      // You can add form validation here if needed
      this.router.navigate(['/checkout']);
    } else {
      this.error = 'Your cart is empty';
    }
  }

  // Method for updating cart item quantities
  updateCartItem(event: { productId: number; quantity: number }): void {
    console.log('CartComponent: Updating cart item:', event);
    if (event.quantity <= 0) {
      this.deleteCartItem(event.productId);
    } else {
      this.cartService.updateCartItem(event.productId, event.quantity).subscribe({
        next: () => {
          console.log('Cart updated');
          this.error = '';
        },
        error: (error) => {
          console.error('Error updating cart:', error);
          this.error = 'Failed to update cart';
        }
      });
    }
  }

  // Handle checkout form submission
  handleCheckout(event: Event): void {
    event.preventDefault();
    console.log('Checkout initiated with data:', this.customerData);

    // Validate form data
    if (!this.isFormValid()) {
      this.error = 'Please fill in all required fields';
      return;
    }

    if (this.cartItems.length === 0) {
      this.error = 'Your cart is empty';
      return;
    }

    // Process checkout
    this.processCheckout();
  }

  // Handle customer form changes
  onCustomerDataChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const fieldName = target.name as keyof CustomerData;
    this.customerData[fieldName] = target.value;
    console.log('Customer data updated:', fieldName, target.value);
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        console.log('Cart cleared');
        this.error = '';
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
        this.error = 'Failed to clear cart';
      }
    });
  }

  // Private helper methods
  private isFormValid(): boolean {
    return !!(
      this.customerData.fullName &&
      this.customerData.phoneNumber &&
      this.customerData.province &&
      this.customerData.city &&
      this.customerData.streetAddress &&
      this.customerData.postalCode
    );
  }

  private processCheckout(): void {
    // Here you would typically call a checkout service
    console.log('Processing checkout...', {
      items: this.cartItems,
      customer: this.customerData,
      total: this.totalPrice
    });

    // For now, just navigate to a success page or show success message
    this.router.navigate(['/checkout-success']);
  }

  // Load recommended items (temporary mock - replace with actual service later)
  private loadRecommendedItems(): void {
    // Mock recommended items for now - using Product interface
    this.recommendedItems = [
      {
        id: 1,
        name: 'Cosmic Dining Table',
        price: 899.99,
        image: '/images/products/mobler/freaky-furniture-ai-cs-2.jpg',
        brand: 'Freaky Furniture',
        description: 'Stunning dining table with otherworldly design elements',
        urlSlug: 'cosmic-dining-table',
        sku: 'MOB002',
        categoryId: 1,
        size: '180x90x75 cm',
        dimensions: 'Length: 180cm, Width: 90cm, Height: 75cm',
        weight: '45.2 kg',
        material: 'Teak',
        specifications: 'Material: Mahogany, Color: Beige, Assembly required: Yes',
        publishingDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Abstract Coffee Table',
        price: 699.99,
        image: '/images/products/mobler/freaky-furniture-ai-cs-4.jpg',
        brand: 'Freaky Furniture',
        description: 'Unique coffee table that doubles as a conversation piece',
        urlSlug: 'abstract-coffee-table',
        sku: 'MOB004',
        categoryId: 1,
        size: '120x70x40 cm',
        dimensions: 'Length: 120cm, Width: 70cm, Height: 40cm',
        weight: '35.8 kg',
        material: 'Pine',
        specifications: 'Material: Metal Frame, Color: White, Assembly required: Minimal',
        publishingDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}
