// src/app/components/product/add-to-cart-button/add-to-cart-button.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../../services/cart.service';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-add-to-cart-button',
  templateUrl: './add-to-cart-button.component.html',
  styleUrls: ['./add-to-cart-button.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AddToCartButtonComponent {
  @Input({ required: true }) product!: Product;
  @Input({ required: true }) quantity!: number;
  @Output() addToCart = new EventEmitter<Product>();

  constructor(private cartService: CartService) {}

  handleAddToCart(): void {
    const cartItem: CartItem = {
      productId: this.product.id,
      name: this.product.name,
      price: this.product.price,
      quantity: this.quantity,
      imageURL: this.product.image,
      brand: this.product.brand || '',
      urlSlug: this.product.urlSlug
    };
    this.cartService.addToCart(cartItem).subscribe({
      next: () => {
        this.addToCart.emit(this.product);
      },
      error: error => {
        console.error('Error adding product to cart:', error);
      }
    });
  }
}
