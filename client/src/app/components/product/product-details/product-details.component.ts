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
        console.log('🔍 Looking for product with urlSlug:', urlSlug);

        // FIXED: Use your working local API instead of the remote one
        this.http.get<any>(`http://localhost:5186/api/products/${urlSlug}`).subscribe({
          next: (product) => {
            this.product = product;
            console.log('✅ Product loaded from local API:', product);

            // FIXED: Also get similar products from local API
            this.http.get<any>(`http://localhost:5186/api/products?categoryName=${product.categoryName}&pageSize=20`).subscribe({
              next: (response) => {
                console.log('📦 Similar products response:', response);
                // Handle both paginated and direct array responses
                const products = response.products || response;
                this.similarItems = products
                  .filter((item: any) => item.urlSlug !== urlSlug)
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 8);
                console.log('✅ Similar items loaded:', this.similarItems.length, this.similarItems);
              },
              error: (error: HttpErrorResponse) => {
                console.error('❌ Error fetching similar items:', error);
                this.similarItems = [];
              }
            });

            // FIXED: Get average rating from local API (if you have this endpoint)
            // For now, let's use a mock rating since your backend might not have this endpoint
            this.averageRating = Math.floor(Math.random() * 5) + 1; // Mock rating 1-5
            console.log('⭐ Mock average rating:', this.averageRating);
          },
          error: (error: HttpErrorResponse) => {
            console.error('❌ Error fetching product from local API:', error);
            console.log('🔄 Trying to find product in ProductService catalog...');

            // Fallback: Try to get all products and find the one with matching urlSlug
            this.http.get<any>(`http://localhost:5186/api/products?pageSize=1000`).subscribe({
              next: (response) => {
                console.log('📋 Full catalog response:', response);
                const allProducts = response.products || response;
                this.product = allProducts.find((p: any) => p.urlSlug === urlSlug);

                if (this.product) {
                  console.log('✅ Product found in catalog:', this.product);

                  // Get similar products from same category
                  this.similarItems = allProducts
                    .filter((item: any) =>
                      item.categoryName === this.product.categoryName &&
                      item.urlSlug !== urlSlug
                    )
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 8);

                  this.averageRating = Math.floor(Math.random() * 5) + 1; // Mock rating
                  console.log('✅ Similar items from catalog:', this.similarItems.length);
                } else {
                  console.error('❌ Product not found in catalog either');
                  this.product = null;
                }
              },
              error: (catalogError: HttpErrorResponse) => {
                console.error('❌ Error loading full catalog:', catalogError);
                this.product = null;
              }
            });
          }
        });
      }
    });
  }

  onAddToCart() {
    console.log('🛒 Add to cart:', this.product);
  }
}
