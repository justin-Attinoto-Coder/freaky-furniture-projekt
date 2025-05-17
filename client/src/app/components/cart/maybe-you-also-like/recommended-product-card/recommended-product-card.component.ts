import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../models/product';

@Component({
  selector: 'app-recommended-product-card',
  templateUrl: './recommended-product-card.component.html',
  styleUrls: ['./recommended-product-card.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class RecommendedProductCardComponent {
  @Input({ required: true }) item!: Product;
  readonly imageBaseUrl = 'https://freaky-angular-furniture-backend.onrender.com';

  // Compute image URL or fallback
  getImageUrl(): string {
    const imagePath = this.item.image?.trim();
    if (imagePath) {
      // Handle various path formats
      let normalizedPath = imagePath;
      if (!imagePath.startsWith('http') && !imagePath.startsWith('/')) {
        normalizedPath = `/images/${imagePath}`; // Add /images/ if missing
      } else if (imagePath.startsWith('http')) {
        normalizedPath = imagePath; // Use absolute URL as-is
      }
      const url = imagePath.startsWith('http') ? imagePath : `${this.imageBaseUrl}${normalizedPath}`;
      console.log(`RecommendedProductCard: Image raw path for ${this.item.name}: ${imagePath}`);
      console.log(`RecommendedProductCard: Image computed URL for ${this.item.name}: ${url}`);
      return url;
    }
    console.log(`RecommendedProductCard: No image for ${this.item.name}, using fallback`);
    return 'https://via.placeholder.com/150?text=No+Image';
  }

  // Handle image load error
  handleImageError(event: Event): void {
    console.log(`RecommendedProductCard: Image failed to load for ${this.item.name}`);
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://via.placeholder.com/150?text=No+Image';
    imgElement.onerror = null; // Prevent infinite error loop
  }
}
