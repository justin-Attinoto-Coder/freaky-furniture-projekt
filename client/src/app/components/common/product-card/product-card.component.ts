import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../models/product';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  isFavorite = false;
  faHeart = faSolidHeart;
  faRegHeart = faRegularHeart;
  readonly imageBaseUrl = 'https://freaky-angular-furniture-backend.onrender.com';

  // Compute image URL or fallback
  getImageUrl(): string {
    const imagePath = this.product.image?.trim();
    if (imagePath) {
      // Handle various path formats
      let normalizedPath = imagePath;
      if (!imagePath.startsWith('http') && !imagePath.startsWith('/')) {
        normalizedPath = `/images/${imagePath}`; // Add /images/ if missing
      } else if (imagePath.startsWith('http')) {
        normalizedPath = imagePath; // Use absolute URL as-is
      }
      const url = imagePath.startsWith('http') ? imagePath : `${this.imageBaseUrl}${normalizedPath}`;
      console.log(`ProductCard: Image raw path for ${this.product.name}: ${imagePath}`);
      console.log(`ProductCard: Image computed URL for ${this.product.name}: ${url}`);
      return url;
    }
    console.log(`ProductCard: No image for ${this.product.name}, using fallback`);
    return 'https://via.placeholder.com/150?text=No+Image';
  }

  // Handle image load error
  handleImageError(event: Event): void {
    console.log(`ProductCard: Image failed to load for ${this.product.name}`);
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://via.placeholder.com/150?text=No+Image';
    imgElement.onerror = null; // Prevent infinite error loop
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    this.isFavorite = !this.isFavorite;
  }
}
