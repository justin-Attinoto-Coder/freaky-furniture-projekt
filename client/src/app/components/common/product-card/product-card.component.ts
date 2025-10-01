import { Component, Input, OnInit } from '@angular/core';
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
export class ProductCardComponent implements OnInit {
  @Input({ required: true }) item!: Product;
  isFavorite = false;
  faHeart = faSolidHeart;
  faRegHeart = faRegularHeart;
  readonly imageBaseUrl = 'https://freaky-angular-furniture-backend.onrender.com';
  isImageLoaded = false;
  hasImageError = false; // Track if we've already had an error

  // Cache the computed image URL to avoid recalculating on every change detection
  private _cachedImageUrl: string | null = null;

  ngOnInit() {
    // Compute the image URL once during initialization
    this._cachedImageUrl = this.computeImageUrl();
  }

  // Public getter that returns the cached URL
  getImageUrl(): string {
    if (this.hasImageError) {
      // Return a data URL for a simple gray placeholder
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
    }
    return this._cachedImageUrl || this.computeImageUrl();
  }

  // Private method to compute the image URL (called only once)
  private computeImageUrl(): string {
    const imagePath = this.item.image?.trim();

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
      return url;
    }

    // Return inline SVG placeholder instead of external service
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  }

  // Handle image load success
  handleImageLoad(): void {
    this.isImageLoaded = true;
    this.hasImageError = false;
  }

  // Handle image load error - prevent infinite loops
  handleImageError(event: Event): void {
    if (this.hasImageError) {
      // Already handled an error, don't do anything more
      return;
    }

    this.hasImageError = true;
    this.isImageLoaded = true; // Treat as loaded to show the fallback

    // Remove the error handler to prevent further errors
    const imgElement = event.target as HTMLImageElement;
    imgElement.onerror = null;

    // Force re-render with the fallback image
    this._cachedImageUrl = null;
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    this.isFavorite = !this.isFavorite;
  }
}
