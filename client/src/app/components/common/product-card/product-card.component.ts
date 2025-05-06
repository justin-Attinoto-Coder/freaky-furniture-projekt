// src/app/components/common/product-card/product-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../models/product';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons'; // Filled heart
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons'; // Outline heart

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  isFavorite = false;
  faHeart = faSolidHeart; // Filled heart icon
  faRegHeart = faRegularHeart; // Outline heart icon

  toggleFavorite(event: Event): void {
    event.preventDefault();
    this.isFavorite = !this.isFavorite;
  }
}
