// src/app/components/cart/recommended-product-card/recommended-product-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../models/product';

@Component({
  selector: 'app-recommended-product-card',
  templateUrl: './recommended-product-card.component.html',
  styleUrls: ['./recommended-product-card.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class RecommendedProductCardComponent {
  @Input({ required: true }) item!: Product;
}
