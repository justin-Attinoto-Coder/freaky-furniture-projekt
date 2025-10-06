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

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  onPurchaseClick(): void {
    if (this.cartItems.length > 0) {
      if (!this.isFormValid()) {
        this.error = 'Please fill in all required customer information';
        return;
      }
      this.router.navigate(['/checkout']);
    } else {
      this.error = 'Your cart is empty';
    }
  }

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

  handleCheckout(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    console.log('Checkout initiated with data:', this.customerData);

    if (!this.isFormValid()) {
      this.error = 'Please fill in all required fields';
      return;
    }

    if (this.cartItems.length === 0) {
      this.error = 'Your cart is empty';
      return;
    }

    this.processCheckout();
  }

  onCustomerDataChange(event: Event): void {
    // Two-way binding handles the data updates automatically
    // This method can be used for additional validation or logging if needed
    console.log('Customer data updated:', this.customerData);
  }

  private isFormValid(): boolean {
    return !!(
      this.customerData.fullName?.trim() &&
      this.customerData.phoneNumber?.trim() &&
      this.customerData.province?.trim() &&
      this.customerData.city?.trim() &&
      this.customerData.streetAddress?.trim() &&
      this.customerData.postalCode?.trim()
    );
  }

  private processCheckout(): void {
    console.log('Processing checkout...', {
      items: this.cartItems,
      customer: this.customerData,
      total: this.totalPrice
    });

    // Validate customer data before sending
    if (!this.customerData.fullName || !this.customerData.phoneNumber ||
        !this.customerData.province || !this.customerData.city ||
        !this.customerData.streetAddress || !this.customerData.postalCode) {
      console.error('Invalid customer data:', this.customerData);
      this.error = 'Please fill in all customer information fields';
      return;
    }

    // Save customer data first
    this.cartService.addCustomer(this.customerData).subscribe({
      next: (response) => {
        console.log('Customer data saved successfully:', response);
        // Navigate to checkout-shipping with cart data
        this.router.navigate(['/checkout-shipping'], {
          state: {
            customerDetails: this.customerData,
            cartItems: this.cartItems,
            totalPrice: this.totalPrice
          }
        }).then(success => {
          console.log('Cart: Navigation to /checkout-shipping successful:', success, {
            cartItems: this.cartItems,
            totalPrice: this.totalPrice
          });
        });
      },
      error: (error) => {
        console.error('Error saving customer data:', error);
        this.error = 'Failed to save customer information. Please try again.';
      }
    });
  }

  private loadRecommendedItems(): void {
    // Load recommended items with proper Product interface
    this.recommendedItems = [
      {
        id: 2,
        name: 'Cosmic Dining Table',
        price: 899.99,
        image: '/images/products/mobler/freaky-furniture-ai-cs-2.jpg',
        brand: 'Freaky Furniture',
        description: 'Stunning dining table with otherworldly design elements that seats 6 people comfortably',
        urlSlug: 'cosmic-dining-table',
        sku: 'MOB002',
        categoryId: 1,
        size: '180x90x75 cm',
        dimensions: 'Length: 180cm, Width: 90cm, Height: 75cm, Leg clearance: 65cm',
        weight: '45.2 kg',
        material: 'Teak',
        specifications: 'Material: Mahogany, Color: Beige, Assembly required: Yes, Warranty: 5 years',
        publishingDate: new Date('2024-11-20'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'Abstract Coffee Table',
        price: 699.99,
        image: '/images/products/mobler/freaky-furniture-ai-cs-4.jpg',
        brand: 'Freaky Furniture',
        description: 'Unique coffee table that doubles as a conversation piece with artistic glass top',
        urlSlug: 'abstract-coffee-table',
        sku: 'MOB004',
        categoryId: 1,
        size: '120x70x40 cm',
        dimensions: 'Length: 120cm, Width: 70cm, Height: 40cm, Glass thickness: 12mm',
        weight: '35.8 kg',
        material: 'Pine',
        specifications: 'Material: Metal Frame, Color: White, Assembly required: Minimal, Warranty: 3 years',
        publishingDate: new Date('2025-04-03'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: 'Whimsical Armchair',
        price: 799.99,
        image: '/images/products/mobler/freaky-furniture-ai-cs-6.jpg',
        brand: 'Freaky Furniture',
        description: 'Comfortable armchair with playful, artistic design and premium upholstery',
        urlSlug: 'whimsical-armchair',
        sku: 'MOB006',
        categoryId: 1,
        size: '78x85x92 cm',
        dimensions: 'Width: 78cm, Depth: 85cm, Height: 92cm, Seat Height: 43cm, Arm Height: 65cm',
        weight: '24.1 kg',
        material: 'Metal Frame',
        specifications: 'Material: Premium Leather, Color: Black, Assembly required: Minimal, Warranty: 3 years',
        publishingDate: new Date('2025-10-04'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}
