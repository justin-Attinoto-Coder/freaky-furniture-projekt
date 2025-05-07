import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../../services/cart.service';

@Component({
  selector: 'app-add-to-cart-button',
  templateUrl: './add-to-cart-button.component.html',
  styleUrls: ['./add-to-cart-button.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AddToCartButtonComponent {
  @Input({ required: true }) product!: any;
  @Input() quantity: number = 1;
  @Output() addToCart = new EventEmitter<any>();

  constructor(private cartService: CartService) {}

  handleAddToCart(): void {
    const cartItem: CartItem = {
      productId: this.product.id,
      name: this.product.name,
      price: this.product.price,
      quantity: this.quantity,
      imageURL: `/images/${this.product.image}`,
      brand: this.product.brand,
      urlSlug: this.product.urlSlug
    };
    this.cartService.addCartItem(cartItem).subscribe({
      next: (response) => {
        console.log('Added to cart:', cartItem, 'Response:', response);
        this.addToCart.emit(this.product);
      },
      error: (error: any) => console.error('Error adding to cart:', error)
    });
  }
}
