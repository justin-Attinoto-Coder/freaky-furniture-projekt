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

  // Base URL for images
  readonly imageBaseUrl = 'http://localhost:8000';

  // Compute image URL or fallback
  getImageUrl(): string {
    const imagePath = this.product.imageURL?.trim();
    if (imagePath) {
      // Handle relative paths (e.g., "/images/product.jpg")
      return imagePath.startsWith('http') ? imagePath : `${this.imageBaseUrl}${imagePath}`;
    }
    // Fallback placeholder image
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