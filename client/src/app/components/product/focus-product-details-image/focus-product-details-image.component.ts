import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './focus-product-details-image.component.html',
  styleUrls: ['./focus-product-details-image.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsImageComponent {
  @Input({ required: true }) image: string = '';
  @Input({ required: true }) name: string = '';
  readonly imageBaseUrl = 'https://freaky-angular-furniture-backend.onrender.com';
  isImageLoaded = false;

  constructor() {
    console.log(`ProductDetailsImage: Component initialized for ${this.name}`);
  }

  ngOnChanges() {
    console.log(`ProductDetailsImage: ngOnChanges for ${this.name}, image: ${this.image}`);
  }

  getImageUrl(image: string): string {
    const imagePath = image?.trim();
    console.log(`ProductDetailsImage: Raw image path for ${this.name}: ${imagePath || 'null/undefined'}`);
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
      console.log(`ProductDetailsImage: Normalized path for ${this.name}: ${normalizedPath}`);
      console.log(`ProductDetailsImage: Computed URL for ${this.name}: ${url}`);
      return url;
    }
    console.log(`ProductDetailsImage: No image for ${this.name}, using fallback`);
    return `${this.imageBaseUrl}/images/hero-one.jfif`; // Use known working image
  }

  handleImageLoad(): void {
    this.isImageLoaded = true;
    console.log(`ProductDetailsImage: Image loaded for ${this.name}, isImageLoaded: ${this.isImageLoaded}`);
  }

  handleImageError(event: Event): void {
    console.log(`ProductDetailsImage: Image failed to load for ${this.name}:`, (event.target as HTMLImageElement).src);
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = `${this.imageBaseUrl}/images/hero-one.jfif`; // Use known working image
    imgElement.onerror = null;
    this.isImageLoaded = true;
    console.log(`ProductDetailsImage: Fallback set for ${this.name}, isImageLoaded: ${this.isImageLoaded}`);
  }
}
