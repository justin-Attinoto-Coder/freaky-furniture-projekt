import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-full flex items-center justify-center">
      <img
        [src]="getImageUrl(image)"
        [alt]="name"
        class="object-cover h-full w-full rounded-lg"
        (error)="handleImageError($event)"
      />
    </div>
  `,
  styles: []
})
export class ProductDetailsImageComponent {
  @Input({ required: true }) image: string = '';
  @Input({ required: true }) name: string = '';

  getImageUrl(image: string): string {
    if (!image) {
      return '/assets/images/fallback.jpg'; // Fallback image in client/src/assets
    }
    return image.startsWith('http') ? image : image; // Use relative path for client/public
  }

  handleImageError(event: Event): void {
    console.error('Failed to load image:', (event.target as HTMLImageElement).src);
    (event.target as HTMLImageElement).src = '/assets/images/fallback.jpg';
  }
}
