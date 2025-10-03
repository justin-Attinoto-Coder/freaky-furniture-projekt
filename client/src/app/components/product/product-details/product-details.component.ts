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
  isLoading = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const urlSlug = params.get('urlSlug');
      if (urlSlug) {
        console.log('🔍 Looking for English product with urlSlug:', urlSlug);
        this.loadProductFromCatalog(urlSlug);
      }
    });
  }

  private loadProductFromCatalog(urlSlug: string) {
    this.isLoading = true;

    // Use the /all endpoint for better performance
    this.http.get<any>(`http://localhost:5186/api/products/all`).subscribe({
      next: (products) => {
        console.log('📋 All English products loaded:', products.length);

        // products is now a direct array from the /all endpoint
        this.product = products.find((p: any) => {
          return p.urlSlug === urlSlug || p.UrlSlug === urlSlug;
        });

        if (this.product) {
          console.log('✅ English product found:', this.product);

          // Get similar products from same category
          this.similarItems = products
            .filter((item: any) =>
              (item.categoryName === this.product.categoryName ||
               item.CategoryName === this.product.CategoryName) &&
              (item.urlSlug !== urlSlug && item.UrlSlug !== urlSlug)
            )
            .sort(() => 0.5 - Math.random())
            .slice(0, 8);

          // Generate mock rating
          this.averageRating = Math.floor(Math.random() * 5) + 1;

          console.log('✅ Similar items found:', this.similarItems.length);
          console.log('⭐ Average rating:', this.averageRating);
        } else {
          console.error('❌ English product not found');
          console.log('📝 Available English urlSlugs:', products.map((p: any) => p.urlSlug || p.UrlSlug));
          this.product = null;
        }

        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error loading English products:', error);
        this.product = null;
        this.isLoading = false;
      }
    });
  }

  onAddToCart() {
    console.log('🛒 Add to cart:', this.product);
  }
}
