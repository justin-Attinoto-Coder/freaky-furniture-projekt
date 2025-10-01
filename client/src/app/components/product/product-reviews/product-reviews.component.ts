import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faStar as faRegStar } from '@fortawesome/free-solid-svg-icons';
import { HttpErrorResponse } from '@angular/common/http'; // FIXED: Changed from '@angular/common/common' to '@angular/common/http'

interface Review {
  id: number;
  productId: number;
  rating: number;
  reviewText: string;
  reviewerName: string;
}

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.css']
})
export class ProductReviewsComponent implements OnInit {
  productId: number | null = null;
  reviews: Review[] = [];
  faStar = faStar;
  faRegStar = faRegStar;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const urlSlug = params.get('urlSlug');
      if (urlSlug) {
        // Use your working local API to get product by urlSlug
        this.http.get<any>(`http://localhost:5186/api/products/${urlSlug}`).subscribe({
          next: (product) => {
            this.productId = product.id;
            console.log('✅ Product loaded for reviews:', product);
            this.fetchReviews();
          },
          error: (error: HttpErrorResponse) => {
            console.error('❌ ProductReviews: Error fetching product:', error);
            this.productId = null;
            this.reviews = [];
          }
        });
      }
    });
  }

  fetchReviews() {
    if (this.productId) {
      // Use your local API for reviews too
      this.http.get<Review[]>(`http://localhost:5186/api/reviews/${this.productId}`).subscribe({
        next: reviews => {
          this.reviews = reviews;
          console.log('✅ ProductReviews: Fetched reviews:', reviews);
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ ProductReviews: Error fetching reviews:', error);
          this.reviews = [];
        }
      });
    }
  }
}
