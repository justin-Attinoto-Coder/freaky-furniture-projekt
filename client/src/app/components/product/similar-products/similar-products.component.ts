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

  // Number of slides to show per breakpoint
  private _slidesToShow: number = 4; // Default for lg (≥1280px)
  private breakpointSlides: { [key: number]: number } = {
    640: 1, // sm
    768: 2, // md
    1024: 3, // lg
    1280: 4  // xl
  };

  ngOnInit() {
    // Update slidesToShow based on window width
    this.updateSlidesToShow();
    window.addEventListener('resize', () => this.updateSlidesToShow());
  }

  updateSlidesToShow() {
    const width = window.innerWidth;
    if (width < 640) {
      this._slidesToShow = 1;
    } else if (width < 768) {
      this._slidesToShow = this.breakpointSlides[640];
    } else if (width < 1024) {
      this._slidesToShow = this.breakpointSlides[768];
    } else if (width < 1280) {
      this._slidesToShow = this.breakpointSlides[1024];
    } else {
      this._slidesToShow = this.breakpointSlides[1280];
    }
    // Adjust currentIndex to stay within bounds
    this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
  }

  get slidesToShow(): number {
    return this._slidesToShow;
  }

  get maxIndex(): number {
    return Math.max(0, Math.ceil(this.similarItems.length / this.slidesToShow) - 1);
  }

  prevSlide(): void {
    this.currentIndex = Math.max(0, this.currentIndex - 1);
  }

  nextSlide(): void {
    this.currentIndex = Math.min(this.maxIndex, this.currentIndex + 1);
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  get totalPages(): number {
    return Math.ceil(this.similarItems.length / this.slidesToShow);
  }

  getPaginationArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
