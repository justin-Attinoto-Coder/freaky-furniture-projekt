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
  // FIXED: Update to your local FreakyFurnitureAPI
  readonly imageBaseUrl = 'http://localhost:5186';

  // Compute image URL or fallback
  getImageUrl(): string {
    const imagePath = this.item.image?.trim();
    console.log(`RecommendedProductCard: Item for ${this.item.name}:`, JSON.stringify(this.item));
    console.log(`RecommendedProductCard: Raw image path for ${this.item.name}: ${imagePath || 'null/undefined'}`);

    if (imagePath) {
      let normalizedPath = imagePath;

      // Handle localhost:8000 URLs (replace with your local API)
      if (imagePath.startsWith('http://localhost:8000')) {
        normalizedPath = imagePath.replace('http://localhost:8000', this.imageBaseUrl);
      }

      // Handle relative paths
      if (!normalizedPath.startsWith('http') && !normalizedPath.startsWith('/')) {
        normalizedPath = `/images/${normalizedPath.replace(/^images\//, '')}`;
      } else if (!normalizedPath.startsWith('http') && normalizedPath.startsWith('/')) {
        normalizedPath = normalizedPath.replace(/^\/+images\//, '/images/');
      }

      const url = normalizedPath.startsWith('http') ? normalizedPath : `${this.imageBaseUrl}${normalizedPath}`;
      console.log(`RecommendedProductCard: Normalized path for ${this.item.name}: ${normalizedPath}`);
      console.log(`RecommendedProductCard: Computed URL for ${this.item.name}: ${url}`);
      return url;
    }

    console.log(`RecommendedProductCard: No image for ${this.item.name}, using fallback`);
    // FIXED: Use your local API for fallback image too
    return `${this.imageBaseUrl}/images/placeholder.jpg`;
  }

  // Handle image load error
  handleImageError(event: Event): void {
    console.log(`RecommendedProductCard: Image failed to load for ${this.item.name}`);
    const imgElement = event.target as HTMLImageElement;
    // FIXED: Use your local API for error fallback
    imgElement.src = `${this.imageBaseUrl}/images/placeholder.jpg`;
    imgElement.onerror = null; // Prevent infinite error loop
  }
}
