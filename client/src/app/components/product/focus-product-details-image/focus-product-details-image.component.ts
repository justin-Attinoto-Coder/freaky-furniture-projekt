import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './focus-product-details-image.component.html',
  styleUrls: ['./focus-product-details-image.component.css']
})
export class ProductDetailsImageComponent {
  @Input({ required: true }) image: string = '';
  @Input({ required: true }) name: string = '';
  readonly imageBaseUrl = 'https://freaky-angular-furniture-backend.onrender.com';
  isImageLoaded = false;

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
    return 'https://via.placeholder.com/300?text=No+Image';
  }

  // Handle image load success
  handleImageLoad(): void {
    this.isImageLoaded = true;
    console.log(`ProductDetailsImage: Image loaded for ${this.name}, isImageLoaded: ${this.isImageLoaded}`);
  }

  // Handle image load error
  handleImageError(event: Event): void {
    console.log(`ProductDetailsImage: Image failed to load for ${this.name}:`, (event.target as HTMLImageElement).src);
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://via.placeholder.com/300?text=No+Image';
    imgElement.onerror = null; // Prevent infinite error loop
    this.isImageLoaded = true; // Treat fallback as loaded
    console.log(`ProductDetailsImage: Fallback set for ${this.name}, isImageLoaded: ${this.isImageLoaded}`);
  }
}
