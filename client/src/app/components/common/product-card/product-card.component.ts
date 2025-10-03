import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faHeart as faSolidHeart, faHeart as faRegularHeart } from '@fortawesome/free-solid-svg-icons';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, FaIconComponent],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input({ required: true }) item!: Product;

  // Add ALL missing properties for the template
  isFavorite = false;
  faHeart = faSolidHeart;
  faRegHeart = faRegularHeart;
  isImageLoaded = false; // Added this missing property

  // FIXED: Use the same working imageBaseUrl as focus-product-card
  readonly imageBaseUrl = 'http://localhost:5186';

  getImageUrl(): string {
    const imagePath = this.item.image?.trim();
    console.log(`ProductCard: Raw image path for ${this.item.name}: ${imagePath || 'null/undefined'}`);

    if (imagePath) {
      let normalizedPath = imagePath;

      // Handle remote URLs - convert to local (same logic as focus-product-card)
      if (imagePath.startsWith('http://localhost:8000') || imagePath.startsWith('https://freaky-angular-furniture-backend.onrender.com')) {
        const pathMatch = imagePath.match(/\/(images\/.+)/);
        normalizedPath = pathMatch ? pathMatch[1] : imagePath;
      }

      // Handle relative paths
      if (!normalizedPath.startsWith('http') && !normalizedPath.startsWith('/')) {
        normalizedPath = `/images/${normalizedPath.replace(/^images\//, '')}`;
      } else if (!normalizedPath.startsWith('http') && normalizedPath.startsWith('/')) {
        normalizedPath = normalizedPath.replace(/^\/+images\//, '/images/');
      }

      const url = normalizedPath.startsWith('http') ? normalizedPath : `${this.imageBaseUrl}${normalizedPath}`;
      console.log(`ProductCard: Normalized path for ${this.item.name}: ${normalizedPath}`);
      console.log(`ProductCard: Computed URL for ${this.item.name}: ${url}`);
      return url;
    }

    console.log(`ProductCard: No image for ${this.item.name}, using fallback`);
    return `${this.imageBaseUrl}/images/placeholder.jpg`;
  }

  // Added missing method for image load handling
  handleImageLoad(): void {
    this.isImageLoaded = true;
    console.log(`ProductCard: Image loaded for ${this.item.name}, isImageLoaded: ${this.isImageLoaded}`);
  }

  handleImageError(event: Event): void {
    console.log(`ProductCard: Image failed to load for ${this.item.name}`);
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = `${this.imageBaseUrl}/images/placeholder.jpg`;
    imgElement.onerror = null;
    this.isImageLoaded = true; // Set to true so the placeholder shows
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation(); // Prevent navigation when clicking heart
    this.isFavorite = !this.isFavorite;
    console.log(`ProductCard: Toggled favorite for ${this.item.name}: ${this.isFavorite}`);
  }
}
