// src/app/components/cart/maybe-you-also-like/maybe-you-also-like.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecommendedProductCardComponent } from './recommended-product-card/recommended-product-card.component';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-maybe-you-also-like',
  templateUrl: './maybe-you-also-like.component.html',
  styleUrls: ['./maybe-you-also-like.component.css'],
  standalone: true,
  imports: [CommonModule, RecommendedProductCardComponent]
})
export class MaybeYouAlsoLikeComponent {
  @Input({ required: true }) items!: Product[];
}
