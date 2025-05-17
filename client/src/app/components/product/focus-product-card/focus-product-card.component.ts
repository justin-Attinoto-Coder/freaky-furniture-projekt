import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsImageComponent } from '../focus-product-details-image/focus-product-details-image.component';
import { FocusProductInformationComponent } from '../focus-product-information/focus-product-information.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faHeart as faSolidHeart, faHeart as faRegularHeart } from '@fortawesome/free-solid-svg-icons';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-focus-product-card',
  standalone: true,
  imports: [CommonModule, ProductDetailsImageComponent, FocusProductInformationComponent, FaIconComponent],
  templateUrl: './focus-product-card.component.html',
  styleUrls: ['./focus-product-card.component.css']
})
export class FocusProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input({ required: true }) averageRating: number = 0;
  @Output() addToCart = new EventEmitter<Product>();
  isFavorite = false;
  faHeart = faSolidHeart;
  faRegHeart = faRegularHeart;
  readonly imageBaseUrl = 'https://freaky-angular-furniture-backend.onrender.com';
  isImageLoaded = false;

  // Compute image URL or fallback
  getImageUrl(): string {
    const imagePath = this.product.image?.trim();
    console.log(`FocusProductCard: Item for ${this.product.name}:`, JSON.stringify(this.product));
    console.log(`FocusProductCard: Raw image path for ${this.product.name}: ${imagePath || 'null/undefined'}`);
    if (imagePath) {
      let normalizedPath = imagePath;
      if (imagePath.startsWith('http://localhost:8000')) {
        normalizedPath = imagePath.replace('http://localhost:8000', this.imageBaseUrl);
      }
      if (!normalizedPath.startsWith('http') && !normalizedPath.startsWith('/')) {
        normalizedPath = `/images/${normalizedPath.replace(/^images\//, '')}`;
      } else if (!normalizedPath.startsWith('http') && normalizedPath.startsWith('/')) {
        normalizedPath = normalizedPath.replace(/^\/+images\//, '/images/');
      }
      const url = normalizedPath.startsWith('http') ? normalizedPath : `${this.imageBaseUrl}${normalizedPath}`;
      console.log(`FocusProductCard: Normalized path for ${this.product.name}: ${normalizedPath}`);
      console.log(`FocusProductCard: Computed URL for ${this.product.name}: ${url}`);
      return url;
    }
    console.log(`FocusProductCard: No image for ${this.product.name}, using fallback`);
    return 'https://via.placeholder.com/300?text=No+Image';
  }

  // Handle image load success
  handleImageLoad(): void {
    this.isImageLoaded = true;
    console.log(`FocusProductCard: Image loaded for ${this.product.name}`);
  }

  // Handle image load error
  handleImageError(event: Event): void {
    console.log(`FocusProductCard: Image failed to load for ${this.product.name}`);
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://via.placeholder.com/300?text=No+Image';
    imgElement.onerror = null; // Prevent infinite error loop
    this.isImageLoaded = true; // Treat fallback as loaded
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    this.isFavorite = !this.isFavorite;
  }
}
