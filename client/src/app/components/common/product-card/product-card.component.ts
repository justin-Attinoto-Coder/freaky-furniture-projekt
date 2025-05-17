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
  @Input({ required: true }) item!: Product;
  isFavorite = false;
  faHeart = faSolidHeart;
  faRegHeart = faRegularHeart;
  readonly imageBaseUrl = 'https://freaky-angular-furniture-backend.onrender.com';

  // Compute image URL or fallback
  getImageUrl(): string {
    const imagePath = this.item.image?.trim();
    console.log(`ProductCard: Item for ${this.item.name}:`, JSON.stringify(this.item));
    console.log(`ProductCard: Raw image path for ${this.item.name}: ${imagePath || 'null/undefined'}`);
    if (imagePath) {
      let normalizedPath = imagePath;
      // Replace localhost URLs with production backend
      if (imagePath.startsWith('http://localhost:8000')) {
        normalizedPath = imagePath.replace('http://localhost:8000', this.imageBaseUrl);
      }
      // Handle relative paths or other non-http URLs
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
    return 'https://via.placeholder.com/150?text=No+Image';
  }

  // Handle image load error
  handleImageError(event: Event): void {
    console.log(`ProductCard: Image failed to load for ${this.item.name}`);
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://via.placeholder.com/150?text=No+Image';
    imgElement.onerror = null; // Prevent infinite error loop
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    this.isFavorite = !this.isFavorite;
  }
}
