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

        // FIXED: Skip individual product lookup since backend doesn't support it
        // Get full catalog and search for the product
        this.loadProductFromCatalog(urlSlug);
      }
    });
  }

  private loadProductFromCatalog(urlSlug: string) {
    this.http.get<any>(`http://localhost:5186/api/products?pageSize=1000`).subscribe({
      next: (response) => {
        console.log('📋 Full catalog response:', response);
        const allProducts = response.products || response;

        // FIXED: Search for product with matching urlSlug
        this.product = allProducts.find((p: any) => {
          console.log(`🔍 Checking product: "${p.urlSlug}" vs "${urlSlug}"`);
          return p.urlSlug === urlSlug;
        });

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

          // Mock rating for now
          this.averageRating = Math.floor(Math.random() * 5) + 1;

          console.log('✅ Similar items found:', this.similarItems.length);
          console.log('⭐ Mock average rating:', this.averageRating);
        } else {
          console.error('❌ Product not found in catalog');
          console.log('📝 Available urlSlugs in catalog:', allProducts.map((p: any) => p.urlSlug));
          this.product = null;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error loading catalog:', error);
        this.product = null;
      }
    });
  }

  onAddToCart() {
    console.log('🛒 Add to cart:', this.product);
  }
}
