// src/app/components/product/focus-product-information/focus-product-information.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AddToCartButtonComponent } from '../add-to-cart-button/add-to-cart-button.component';
import { FocusOverviewAccordionComponent } from '../focus-overview-accordion/focus-overview-accordion.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegStar } from '@fortawesome/free-regular-svg-icons';
import { Product } from '../../../models/product';

interface Review {
  rating: number;
  reviewText: string;
  reviewerName: string;
}

@Component({
  selector: 'app-focus-product-information',
  templateUrl: './focus-product-information.component.html',
  styleUrls: ['./focus-product-information.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, AddToCartButtonComponent, FocusOverviewAccordionComponent, FaIconComponent]
})
export class FocusProductInformationComponent implements OnInit {
  @Input({ required: true }) product!: Product;
  @Input({ required: true }) averageRating!: number;
  @Output() addToCart = new EventEmitter<Product>();
  quantity = 1;
  reviews: Review[] = [];
  faStar = faStar;
  faRegStar = faRegStar;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Review[]>(`http://localhost:8000/api/reviews/${this.product.id}`).subscribe({
      next: reviews => {
        this.reviews = reviews;
      },
      error: error => {
        console.error('Error fetching reviews:', error);
      }
    });
  }

  handleQuantityChange(amount: number): void {
    this.quantity = Math.max(1, this.quantity + amount);
  }

  onAddToCart(product: Product): void {
    this.addToCart.emit(product);
  }
}
