import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-go-to-cart-button',
  templateUrl: './go-to-cart-button.component.html',
  styleUrls: ['./go-to-cart-button.component.scss']
})
export class GoToCartButtonComponent {
  @Input() buttonText: string = 'Gå till kundvagn';
  @Input() showIcon: boolean = true;
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'secondary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  cartItemCount$ = this.cartService.cartItems$.pipe(
    map(items => items.reduce((count, item) => count + item.quantity, 0))
  );

  constructor(
    private router: Router,
    private cartService: CartService
  ) {}

  goToCart(): void {
    console.log('🛒 Navigating to cart page');
    this.router.navigate(['/cart']);
  }
}