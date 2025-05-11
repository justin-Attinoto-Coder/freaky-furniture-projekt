import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FocusProductCardComponent } from '../../product/focus-product-card/focus-product-card.component';
import { SimilarProductsComponent } from '../../product/similar-products/similar-products.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonAccordionComponent } from '../../common/common-accordion/common-accordion.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FocusProductCardComponent, SimilarProductsComponent, CommonAccordionComponent],
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
        this.http.get<any>(`https://freaky-angular-furniture-backend.onrender.com/api/furniture/${urlSlug}`).subscribe({
          next: (product) => {
            this.product = product;
            // Fetch average rating
            this.http.get<any>(`https://freaky-angular-furniture-backend.onrender.com/api/reviews/${product.id}/average`).subscribe({
              next: (response) => {
                this.averageRating = response.averageRating || 0;
                console.log('Average rating fetched:', this.averageRating);
              },
              error: (error: HttpErrorResponse) => {
                console.error('Error fetching average rating:', error);
                this.averageRating = 0;
              }
            });
            // Fetch similar items (limited to 8)
            this.http.get<any[]>(`https://freaky-angular-furniture-backend.onrender.com/api/furniture?category=${product.category}&limit=8`).subscribe({
              next: (items) => {
                this.similarItems = items
                  .filter(item => item.urlSlug !== urlSlug)
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 8);
                console.log('Similar items:', this.similarItems.length, this.similarItems);
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
    console.log('Add to cart:', this.product);
  }
}
