import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
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
  styleUrls: ['./product-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Add this line
})
export class ProductCardComponent {
  @Input({ required: true }) item!: Product;

  // Add ALL missing properties for the template
  isFavorite = false;
  faHeart = faSolidHeart;
  faRegHeart = faRegularHeart;
  isImageLoaded = false;

  // Cache the computed URL to prevent re-computation
  private _imageUrl: string | null = null;

  readonly imageBaseUrl = 'http://localhost:5186';

  getImageUrl(): string {
    // Cache the result to prevent repeated calls
    if (this._imageUrl) {
      return this._imageUrl;
    }

    const imagePath = this.item.image?.trim();
    console.log(`ProductCard: Computing image URL for ${this.item.name}`);

    if (imagePath) {
      let normalizedPath = imagePath;

      if (imagePath.startsWith('http://localhost:8000') || imagePath.startsWith('https://freaky-angular-furniture-backend.onrender.com')) {
        const pathMatch = imagePath.match(/\/(images\/.+)/);
        normalizedPath = pathMatch ? pathMatch[1] : imagePath;
      }

      if (!normalizedPath.startsWith('http') && !normalizedPath.startsWith('/')) {
        normalizedPath = `/images/${normalizedPath.replace(/^images\//, '')}`;
      } else if (!normalizedPath.startsWith('http') && normalizedPath.startsWith('/')) {
        normalizedPath = normalizedPath.replace(/^\/+images\//, '/images/');
      }

      this._imageUrl = normalizedPath.startsWith('http') ? normalizedPath : `${this.imageBaseUrl}${normalizedPath}`;
      return this._imageUrl;
    }

    this._imageUrl = `${this.imageBaseUrl}/images/placeholder.jpg`;
    return this._imageUrl;
  }

  handleImageLoad(): void {
    this.isImageLoaded = true;
    console.log(`ProductCard: Image loaded for ${this.item.name}`);
  }

  handleImageError(event: Event): void {
    console.log(`ProductCard: Image failed for ${this.item.name}`);
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = `${this.imageBaseUrl}/images/placeholder.jpg`;
    imgElement.onerror = null;
    this.isImageLoaded = true;
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isFavorite = !this.isFavorite;
  }
}
