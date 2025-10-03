import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
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
  styleUrls: ['./focus-product-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FocusProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input({ required: true }) averageRating: number = 0;
  @Output() addToCart = new EventEmitter<Product>();
  isFavorite = false;
  faHeart = faSolidHeart;
  faRegHeart = faRegularHeart;

  // FIXED: Point to your local FreakyFurnitureAPI
  readonly imageBaseUrl = 'http://localhost:5186';
  isImageLoaded = false;

  constructor() {
    console.log(`FocusProductCard: Component initialized for ${this.product?.name}`);
  }

  ngOnChanges() {
    console.log(`FocusProductCard: ngOnChanges for ${this.product?.name}, product:`, this.product);
  }

  getImageUrl(): string {
    const imagePath = this.product.image?.trim();
    console.log(`FocusProductCard: Raw image path for ${this.product.name}: ${imagePath || 'null/undefined'}`);

    if (imagePath) {
      let normalizedPath = imagePath;

      // Handle remote URLs - convert to local
      if (imagePath.startsWith('http://localhost:8000') || imagePath.startsWith('https://freaky-angular-furniture-backend.onrender.com')) {
        // Extract the path part and use local API
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
      console.log(`FocusProductCard: Normalized path for ${this.product.name}: ${normalizedPath}`);
      console.log(`FocusProductCard: Computed URL for ${this.product.name}: ${url}`);
      return url;
    }

    console.log(`FocusProductCard: No image for ${this.product.name}, using fallback`);
    return `${this.imageBaseUrl}/images/placeholder.jpg`;
  }

  handleImageLoad(): void {
    this.isImageLoaded = true;
    console.log(`FocusProductCard: Image loaded for ${this.product.name}, isImageLoaded: ${this.isImageLoaded}`);
  }

  handleImageError(event: Event): void {
    console.log(`FocusProductCard: Image failed to load for ${this.product.name}:`, (event.target as HTMLImageElement).src);
    const imgElement = event.target as HTMLImageElement;
    // Use a simple placeholder instead of hero-one.jfif
    imgElement.src = `${this.imageBaseUrl}/images/placeholder.jpg`;
    imgElement.onerror = null;
    this.isImageLoaded = true;
    console.log(`FocusProductCard: Fallback set for ${this.product.name}, isImageLoaded: ${this.isImageLoaded}`);
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    this.isFavorite = !this.isFavorite;
  }
}
