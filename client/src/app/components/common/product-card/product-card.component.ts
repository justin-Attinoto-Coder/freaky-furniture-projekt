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

  // Cache the computed image URL to avoid recalculating on every change detection
  private _cachedImageUrl: string | null = null;

  ngOnInit() {
    // Compute the image URL once during initialization
    this._cachedImageUrl = this.computeImageUrl();
  }

  // Public getter that returns the cached URL
  getImageUrl(): string {
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

    return 'https://via.placeholder.com/150?text=No+Image';
  }

  // Handle image load success
  handleImageLoad(): void {
    this.isImageLoaded = true;
    // Only log if needed for debugging
    // console.log(`ProductCard: Image loaded for ${this.item.name}`);
  }

  // Handle image load error
  handleImageError(event: Event): void {
    // Only log if needed for debugging
    // console.log(`ProductCard: Image failed to load for ${this.item.name}`);
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://via.placeholder.com/150?text=No+Image';
    imgElement.onerror = null; // Prevent infinite error loop
    this.isImageLoaded = true; // Treat fallback as loaded to hide placeholder
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    this.isFavorite = !this.isFavorite;
  }
}
