import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsImageComponent } from '../focus-product-details-image/focus-product-details-image.component';
import { FocusProductInformationComponent } from '../focus-product-information/focus-product-information.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faHeart as faSolidHeart, faHeart as faRegularHeart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-focus-product-card',
  standalone: true,
  imports: [CommonModule, ProductDetailsImageComponent, FocusProductInformationComponent, FaIconComponent],
  templateUrl: './focus-product-card.component.html',
  styleUrls: ['./focus-product-card.component.css']
})
export class FocusProductCardComponent {
  @Input({ required: true }) product: any = {};
  @Input({ required: true }) averageRating: number = 0;
  @Output() addToCart = new EventEmitter<any>();
  isFavorite = false;
  faHeart = faSolidHeart;
  faRegHeart = faRegularHeart;

  toggleFavorite(event: Event): void {
    event.preventDefault();
    this.isFavorite = !this.isFavorite;
  }
}
