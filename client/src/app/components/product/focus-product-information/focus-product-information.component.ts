import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Add this import
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AddToCartButtonComponent } from '../add-to-cart-button/add-to-cart-button.component';
import { GoToCartComponent } from '../go-to-cart-button/go-to-cart.component';
import { FocusOverviewAccordionComponent } from '../focus-overview-accordion/focus-overview-accordion.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faStar as faRegStar } from '@fortawesome/free-solid-svg-icons';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from '../../../services/cart.service';

interface Review {
  rating: number;
  reviewText: string;
  reviewerName: string;
}

@Component({
  selector: 'app-focus-product-information',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, // Add this to imports array
    RouterModule, 
    AddToCartButtonComponent, 
    GoToCartComponent,
    FocusOverviewAccordionComponent, 
    FontAwesomeModule
  ],
  templateUrl: './focus-product-information.component.html',
  styleUrls: ['./focus-product-information.component.css']
})
export class FocusProductInformationComponent implements OnInit, OnChanges {
  @Input({ required: true }) product: any = {};
  @Input({ required: true }) averageRating: number = 0;
  @Output() addToCart = new EventEmitter<any>();
  quantity = 1;
  reviews: Review[] = [];
  faStar = faStar;
  faRegStar = faRegStar;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('FocusProductInformation init:', { averageRating: this.averageRating, productId: this.product.id });
    this.generateMockReviews();
  }

  ngOnChanges() {
    this.generateMockReviews();
  }

  private generateMockReviews() {
    const reviewTemplates = [
      {
        rating: 5,
        reviewText: `Excellent ${this.product.name?.toLowerCase() || 'product'}! Very comfortable and stylish. Highly recommend!`,
        reviewerName: 'Anna S.'
      },
      {
        rating: 4,
        reviewText: `Good quality and fast delivery. The ${this.product.name?.toLowerCase() || 'product'} looks great in my room.`,
        reviewerName: 'Erik L.'
      },
      {
        rating: 5,
        reviewText: `Perfect fit for my needs. Great value for money from ${this.product.brand || 'this brand'}.`,
        reviewerName: 'Maria K.'
      },
      {
        rating: 4,
        reviewText: `Nice design and good build quality. Would buy from ${this.product.brand || 'this brand'} again.`,
        reviewerName: 'Johan A.'
      }
    ];

    const numberOfReviews = Math.floor(Math.random() * 2) + 2;
    this.reviews = reviewTemplates
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfReviews);

    console.log('📝 Generated mock reviews:', this.reviews);
  }

  handleQuantityChange(amount: number): void {
    this.quantity = Math.max(1, this.quantity + amount);
  }

  onAddToCart(product: any): void {
    this.addToCart.emit(product);
  }

  goToCart(): void {
    console.log('🛒 Navigating to cart page');
    this.router.navigate(['/cart']);
  }
}
