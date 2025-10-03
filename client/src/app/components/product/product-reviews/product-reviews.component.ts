import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faStar as faRegStar } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';

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
  product: Product | null = null;
  reviews: Review[] = [];
  faStar = faStar;
  faRegStar = faRegStar;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const urlSlug = params.get('urlSlug');
      console.log('🔍 ProductReviews: Route urlSlug parameter:', urlSlug);

      if (urlSlug) {
        this.isLoading = true;

        // ✅ Use ProductService instead of direct HTTP calls
        this.productService.getAllProducts().subscribe({
          next: (products) => {
            console.log('✅ ProductReviews: All products loaded:', products.length);

            // Find product by urlSlug
            const foundProduct = products.find(p => p.urlSlug === urlSlug);

            if (foundProduct) {
              this.product = foundProduct;
              console.log('✅ ProductReviews: Found product:', foundProduct);
              this.generateMockReviews(foundProduct);
            } else {
              console.error('❌ ProductReviews: Product not found with urlSlug:', urlSlug);
              this.generateMockReviewsFromSlug(urlSlug);
            }

            this.isLoading = false;
          },
          error: (error) => {
            console.error('❌ ProductReviews: Error fetching products:', error);
            this.generateMockReviewsFromSlug(urlSlug);
            this.isLoading = false;
          }
        });
      }
    });
  }

  // Generate mock reviews based on actual product data
  private generateMockReviews(product: Product) {
    console.log('🎭 Generating mock reviews for product:', product.name);

    this.reviews = [
      {
        id: 1,
        productId: product.id,
        rating: 5,
        reviewText: `Amazing ${product.name}! The quality exceeded my expectations. Very comfortable and stylish.`,
        reviewerName: 'Sarah Johnson'
      },
      {
        id: 2,
        productId: product.id,
        rating: 4,
        reviewText: `Good quality furniture. The ${product.name.toLowerCase()} looks great in my living room. Fast delivery too!`,
        reviewerName: 'Mike Wilson'
      },
      {
        id: 3,
        productId: product.id,
        rating: 5,
        reviewText: `Perfect addition to my home. The ${product.name.toLowerCase()} is both functional and beautiful. Highly recommend!`,
        reviewerName: 'Emma Davis'
      },
      {
        id: 4,
        productId: product.id,
        rating: 4,
        reviewText: `Great value for ${product.price} SEK. The design is modern and fits perfectly with my decor.`,
        reviewerName: 'John Smith'
      },
      {
        id: 5,
        productId: product.id,
        rating: 5,
        reviewText: `Excellent craftsmanship! The ${product.category.toLowerCase()} category really delivers quality products.`,
        reviewerName: 'Lisa Chen'
      }
    ];
  }

  // Fallback: Generate mock reviews from URL slug if product not found
  private generateMockReviewsFromSlug(urlSlug: string) {
    console.log('🎭 Generating fallback mock reviews for urlSlug:', urlSlug);
    const productName = urlSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    this.reviews = [
      {
        id: 1,
        productId: 0, // Unknown since product not found
        rating: 5,
        reviewText: `Amazing ${productName}! The quality exceeded my expectations. Very comfortable and stylish.`,
        reviewerName: 'Sarah Johnson'
      },
      {
        id: 2,
        productId: 0,
        rating: 4,
        reviewText: `Good quality furniture. The ${productName.toLowerCase()} looks great in my living room. Fast delivery too!`,
        reviewerName: 'Mike Wilson'
      },
      {
        id: 3,
        productId: 0,
        rating: 5,
        reviewText: `Perfect addition to my home. The ${productName.toLowerCase()} is both functional and beautiful. Highly recommend!`,
        reviewerName: 'Emma Davis'
      },
      {
        id: 4,
        productId: 0,
        rating: 4,
        reviewText: `Great value for money. The design is modern and fits perfectly with my decor.`,
        reviewerName: 'John Smith'
      }
    ];
  }
}
