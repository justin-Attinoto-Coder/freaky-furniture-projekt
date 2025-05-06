import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../common/product-card/product-card.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-similar-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, SlickCarouselModule],
  templateUrl: './similar-products.component.html',
  styleUrls: ['./similar-products.component.css']
})
export class SimilarProductsComponent {
  @Input({ required: true }) similarItems: any[] = [];
  slideConfig = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: '<div class="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 cursor-pointer"><i class="fa fa-arrow-right text-3xl text-gray-700 hover:text-gray-900"></i></div>',
    prevArrow: '<div class="absolute top-1/2 -left-5 transform -translate-y-1/2 z-10 cursor-pointer"><i class="fa fa-arrow-left text-3xl text-gray-700 hover:text-gray-900"></i></div>',
    responsive: [
      { breakpoint: 2560, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 1920, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 1536, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 1280, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  };
}
