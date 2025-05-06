// src/app/components/product/focus-product-details-image/focus-product-details-image.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details-image',
  templateUrl: './focus-product-details-image.component.html',
  styleUrls: ['./focus-product-details-image.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductDetailsImageComponent {
  @Input({ required: true }) image!: string;
  @Input({ required: true }) name!: string;
}
