import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../common/product-card/product-card.component';

@Component({
  selector: 'app-similar-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './similar-products.component.html',
  styleUrls: ['./similar-products.component.css']
})
export class SimilarProductsComponent {
  @Input({ required: true }) similarItems: any[] = [];
  currentIndex: number = 0;

  prevSlide(): void {
    this.currentIndex = Math.max(0, this.currentIndex - 1);
  }

  nextSlide(): void {
    this.currentIndex = Math.min(this.similarItems.length - 1, this.currentIndex + 1);
  }
}
