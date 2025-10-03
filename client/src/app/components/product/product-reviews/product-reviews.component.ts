import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faStar as faRegStar } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../../services/product.service';
import { ReviewService, Review } from '../../../services/review.service';
import { Product } from '../../../models/product';

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
  averageRating = 0;
  totalReviews = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const urlSlug = params.get('urlSlug');
      console.log('🔍 ProductReviews: Route urlSlug parameter:', urlSlug);

      if (urlSlug) {
        this.loadProductAndReviews(urlSlug);
      }
    });
  }

  private loadProductAndReviews(urlSlug: string) {
    this.isLoading = true;

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        console.log('✅ ProductReviews: All products loaded:', products.length);

        const foundProduct = products.find(p => p.urlSlug === urlSlug);

        if (foundProduct) {
          this.product = foundProduct;
          console.log('✅ ProductReviews: Found product:', foundProduct);

          // Try to load real reviews first, fallback to mock if API not ready
          this.tryLoadRealReviews(foundProduct);
        } else {
          console.error('❌ ProductReviews: Product not found with urlSlug:', urlSlug);
          this.generateMockReviewsFromSlug(urlSlug);
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('❌ ProductReviews: Error fetching products:', error);
        this.generateMockReviewsFromSlug(urlSlug);
        this.isLoading = false;
      }
    });
  }

  private tryLoadRealReviews(product: Product) {
    this.reviewService.getReviewsByProductId(product.id).subscribe({
      next: (reviews) => {
        console.log('✅ Real reviews loaded from database:', reviews.length);
        this.reviews = reviews;
        this.loadAverageRating(product.id);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ API not ready, using mock reviews:', error);
        // Fallback to mock reviews if API endpoints don't exist yet
        this.generateMockReviews(product);
        this.isLoading = false;
      }
    });
  }

  private loadAverageRating(productId: number) {
    this.reviewService.getAverageRating(productId).subscribe({
      next: (data) => {
        this.averageRating = data.averageRating;
        this.totalReviews = data.totalReviews;
        console.log('✅ Average rating loaded:', data);
      },
      error: (error) => {
        console.error('❌ Error fetching average rating:', error);
        this.calculateAverageFromCurrentReviews();
      }
    });
  }

  private calculateAverageFromCurrentReviews() {
    if (this.reviews.length > 0) {
      const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
      this.averageRating = sum / this.reviews.length;
      this.totalReviews = this.reviews.length;
    }
  }

  // Generate mock reviews based on actual product data (FIXED LINE 110)
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
        // 🔧 FIXED: Use product.name and product.brand instead of product.category
        reviewText: `Excellent craftsmanship! This ${product.name.toLowerCase()} really delivers quality. Great product from ${product.brand}!`,
        reviewerName: 'Lisa Chen'
      }
    ];

    this.calculateAverageFromCurrentReviews();
  }

  // Fallback: Generate mock reviews from URL slug if product not found
  private generateMockReviewsFromSlug(urlSlug: string) {
    console.log('🎭 Generating fallback mock reviews for urlSlug:', urlSlug);
    const productName = urlSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    this.reviews = [
      {
        id: 1,
        productId: 0,
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

    this.calculateAverageFromCurrentReviews();
  }
}
