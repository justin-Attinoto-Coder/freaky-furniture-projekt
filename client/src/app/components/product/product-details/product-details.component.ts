import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FocusProductCardComponent } from '../focus-product-card/focus-product-card.component';
import { SimilarProductsComponent } from '../similar-products/similar-products.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FocusProductCardComponent, SimilarProductsComponent],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: any = null;
  similarItems: any[] = [];
  averageRating: number = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const urlSlug = params.get('urlSlug');
      if (urlSlug) {
        // Fetch product by urlSlug
        this.http.get<any>(`http://localhost:8000/api/furniture/${urlSlug}`).subscribe({
          next: (product) => {
            this.product = product;
            // Fetch average rating
            this.http.get<any>(`http://localhost:8000/api/reviews/${product.id}/average`).subscribe({
              next: (response) => {
                this.averageRating = response.averageRating || 0;
              },
              error: (error: HttpErrorResponse) => {
                console.error('Error fetching average rating:', error);
              }
            });
            // Fetch similar items
            this.http.get<any[]>(`http://localhost:8000/api/furniture?category=${product.category}`).subscribe({
              next: (items) => {
                this.similarItems = items
                  .filter(item => item.urlSlug !== urlSlug)
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 4);
              },
              error: (error: HttpErrorResponse) => {
                console.error('Error fetching similar items:', error);
              }
            });
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error fetching product:', error);
            this.product = null;
          }
        });
      }
    });
  }

  onAddToCart() {
    // Implement add-to-cart logic (to be expanded later)
    console.log('Add to cart:', this.product);
  }
}
