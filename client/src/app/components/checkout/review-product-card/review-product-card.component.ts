import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-product-card.component.html',
  styleUrls: ['./review-product-card.component.css']
})
export class ReviewProductCardComponent {
  @Input() product: any = {};
  @Output() quantityChange = new EventEmitter<number>();

  // Base URL for images - using ASP.NET Core API
  readonly imageBaseUrl = 'http://localhost:5186';

  // Compute image URL or fallback
  getImageUrl(): string {
    const imagePath = this.product.imageURL?.trim();
    console.log('ReviewProductCard: Getting image URL for product:', this.product.name, 'imageURL:', imagePath);

    if (imagePath) {
      // Handle relative paths (e.g., "/images/product.jpg")
      const fullUrl = imagePath.startsWith('http') ? imagePath : `${this.imageBaseUrl}${imagePath}`;
      console.log('ReviewProductCard: Full image URL:', fullUrl);
      return fullUrl;
    }
    // Fallback placeholder image
    console.log('ReviewProductCard: Using placeholder image for:', this.product.name);
    return 'https://via.placeholder.com/64?text=No+Image';
  }

  decreaseQuantity() {
    console.log('ReviewProductCard: Decreasing quantity for productId:', this.product.productId);
    this.quantityChange.emit(this.product.quantity - 1);
  }

  increaseQuantity() {
    console.log('ReviewProductCard: Increasing quantity for productId:', this.product.productId);
    this.quantityChange.emit(this.product.quantity + 1);
  }
}
