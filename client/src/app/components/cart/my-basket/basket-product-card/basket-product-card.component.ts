import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../../../services/cart.service';

@Component({
  selector: 'app-basket-product-card',
  templateUrl: './basket-product-card.component.html',
  styleUrls: ['./basket-product-card.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class BasketProductCardComponent {
  @Input({ required: true }) item!: CartItem;
  @Output() updateCartItem = new EventEmitter<{ productId: number; quantity: number }>();
  @Output() deleteCartItem = new EventEmitter<number>();

  // Base URL for images
readonly imageBaseUrl = 'https://freaky-angular-furniture-backend.onrender.com';
  // Compute image URL or fallback
  getImageUrl(): string {
    const imagePath = this.item.imageURL?.trim();
    if (imagePath) {
      // Handle relative paths (e.g., "/images/product.jpg")
      return imagePath.startsWith('http') ? imagePath : `${this.imageBaseUrl}${imagePath}`;
    }
    // Fallback placeholder image
    return 'https://via.placeholder.com/64?text=No+Image';
  }

  handleQuantityChange(amount: number): void {
    const newQuantity = Math.max(1, this.item.quantity + amount);
    console.log('BasketProductCard: Emitting updateCartItem for productId:', this.item.productId, 'newQuantity:', newQuantity);
    this.updateCartItem.emit({ productId: this.item.productId, quantity: newQuantity });
  }

  onDeleteCartItem(productId: number): void {
    console.log('BasketProductCard: Emitting deleteCartItem for productId:', productId);
    this.deleteCartItem.emit(productId);
  }
}
