import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Add this import
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-go-to-cart',
  standalone: true, // Add this if using standalone components
  imports: [CommonModule], // Add this imports array
  templateUrl: './go-to-cart.component.html',
  styleUrls: ['./go-to-cart.component.css']
})
export class GoToCartComponent implements OnInit {
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showIcon: boolean = true;
  @Input() buttonText: string = 'Gå till kundvagn';
  @Input() showCartCount: boolean = true;

  cartItemCount$: Observable<number>;

  constructor(
    private router: Router,
    private cartService: CartService
  ) {
    this.cartItemCount$ = this.cartService.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  }

  ngOnInit(): void {
    console.log('GoToCartComponent: Initialized with variant:', this.variant, 'size:', this.size);
  }

  goToCart(): void {
    console.log('🛒 GoToCartComponent: Navigating to cart page');
    this.router.navigate(['/cart']);
  }

  getButtonClasses(): string {
    const baseClasses = 'go-to-cart-btn relative inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    // Variant classes
    const variantClasses = {
      primary: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
      outline: 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500 bg-transparent'
    };

    return `${baseClasses} ${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }
}
