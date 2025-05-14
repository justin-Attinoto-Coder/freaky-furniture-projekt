import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AddToCartButtonComponent } from '../add-to-cart-button/add-to-cart-button.component';
import { FocusOverviewAccordionComponent } from '../focus-overview-accordion/focus-overview-accordion.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faStar as faRegStar } from '@fortawesome/free-solid-svg-icons';
import { HttpErrorResponse } from '@angular/common/http';

interface Review {
  rating: number;
  reviewText: string;
  reviewerName: string;
}

@Component({
  selector: 'app-focus-product-information',
  standalone: true,
  imports: [CommonModule, RouterModule, AddToCartButtonComponent, FocusOverviewAccordionComponent, FontAwesomeModule],
  templateUrl: './focus-product-information.component.html',
  styleUrls: ['./focus-product-information.component.css']
})
export class FocusProductInformationComponent implements OnInit {
  @Input({ required: true }) product: any = {};
  @Input({ required: true }) averageRating: number = 0;
  @Output() addToCart = new EventEmitter<any>();
  quantity = 1;
  reviews: Review[] = [];
  faStar = faStar;
  faRegStar = faRegStar;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('FocusProductInformation init:', { averageRating: this.averageRating, productId: this.product.id });
    this.http.get<Review[]>(`https://freaky-angular-furniture-backend.onrender.com/api/reviews/${this.product.id}`).subscribe({
      next: reviews => {
        this.reviews = reviews;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching reviews:', error);
      }
    });
  }

  handleQuantityChange(amount: number): void {
    this.quantity = Math.max(1, this.quantity + amount);
  }

  onAddToCart(product: any): void {
    this.addToCart.emit(product);
  }
}
