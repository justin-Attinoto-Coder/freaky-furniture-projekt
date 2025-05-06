// src/app/components/product/focus-product-card/focus-product-card.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsImageComponent } from '../focus-product-details-image/focus-product-details-image.component';
import { FocusProductInformationComponent } from '../focus-product-information/focus-product-information.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faHeart as faSolidHeart, faHeart as faRegularHeart } from '@fortawesome/free-solid-svg-icons';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-focus-product-card',
  templateUrl: './focus-product-card.component.html',
  styleUrls: ['./focus-product-card.component.css'],
  standalone: true,
  imports: [CommonModule, ProductDetailsImageComponent, FocusProductInformationComponent, FaIconComponent]
})
export class FocusProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input({ required: true }) averageRating!: number;
  @Output() addToCart = new EventEmitter<Product>();
  isFavorite = false;
  faHeart = faSolidHeart;
  faRegHeart = faRegularHeart;

  toggleFavorite(event: Event): void {
    event.preventDefault();
    this.isFavorite = !this.isFavorite;
  }
}
