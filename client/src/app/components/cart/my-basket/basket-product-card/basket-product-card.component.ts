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
export class BasketProductCardComponent { // Make sure 'export' is here
  @Input({ required: true }) item!: CartItem;
  @Output() updateCartItem = new EventEmitter<{ productId: number; quantity: number }>();
  @Output() deleteCartItem = new EventEmitter<number>();
  
  // Fix: Use local API URL instead of Render.com
  readonly imageBaseUrl = 'http://localhost:5186';

  // Compute image URL or fallback
  getImageUrl(): string {
    const imagePath = this.item.imageURL?.trim();
    console.log(`BasketProductCard: Raw image path for ${this.item.name}: ${imagePath || 'null/undefined'}`);
    
    if (imagePath) {
      let normalizedPath = imagePath;
      
      // Handle different image path formats
      if (imagePath.startsWith('http')) {
        // Already a full URL
        return imagePath;
      } else if (imagePath.startsWith('/images/')) {
        // Already properly formatted path
        normalizedPath = imagePath;
      } else if (imagePath.startsWith('images/')) {
        // Add leading slash
        normalizedPath = `/${imagePath}`;
      } else if (!imagePath.startsWith('/')) {
        // Add /images/ prefix
        normalizedPath = `/images/${imagePath}`;
      }
      
      const url = `${this.imageBaseUrl}${normalizedPath}`;
      console.log(`BasketProductCard: Normalized path for ${this.item.name}: ${normalizedPath}`);
      console.log(`BasketProductCard: Computed URL for ${this.item.name}: ${url}`);
      return url;
    }
    
    console.log(`BasketProductCard: No image for ${this.item.name}, using fallback`);
    return 'https://via.placeholder.com/64?text=No+Image';
  }

  // Handle image load error
  handleImageError(event: Event): void {
    console.log(`BasketProductCard: Image failed to load for ${this.item.name}`);
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://via.placeholder.com/64?text=No+Image';
    imgElement.onerror = null; // Prevent infinite error loop
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
