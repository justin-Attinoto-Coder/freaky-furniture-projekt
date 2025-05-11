import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faStar as faRegStar } from '@fortawesome/free-solid-svg-icons';
import { HttpErrorResponse } from '@angular/common/http';

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
        // Fetch product by urlSlug to get productId
        this.http.get<any>(`https://freaky-angular-furniture-backend.onrender.com/api/furniture/${urlSlug}`).subscribe({
          next: (product) => {
            this.productId = product.id;
            this.fetchReviews();
          },
          error: (error: HttpErrorResponse) => {
            console.error('ProductReviews: Error fetching product:', error);
            this.productId = null;
            this.reviews = [];
          }
        });
      }
    });
  }

  fetchReviews() {
    if (this.productId) {
      this.http.get<Review[]>(`https://freaky-angular-furniture-backend.onrender.com/api/reviews/${this.productId}`).subscribe({
        next: reviews => {
          this.reviews = reviews;
          console.log('ProductReviews: Fetched reviews:', reviews);
        },
        error: (error: HttpErrorResponse) => {
          console.error('ProductReviews: Error fetching reviews:', error);
          this.reviews = [];
        }
      });
    }
  }
}
