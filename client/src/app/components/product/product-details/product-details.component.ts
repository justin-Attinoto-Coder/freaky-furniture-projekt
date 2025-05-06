import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FocusProductCardComponent } from '../focus-product-card/focus-product-card.component';
import { SimilarProductsComponent } from '../similar-products/similar-products.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FocusProductCardComponent, SimilarProductsComponent],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: any;
  similarItems: any[] = [];
  averageRating: number = 0;
  furnitureItems: any[] = []; // Replace with actual data source

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const urlSlug = params.get('urlSlug');
      this.product = this.furnitureItems.find(item => item.urlSlug === urlSlug);
      if (this.product) {
        this.http.get(`http://localhost:8000/api/reviews/${this.product.id}/average`).subscribe({
          next: (response: any) => this.averageRating = response.averageRating,
          error: (error) => console.error('Error fetching average rating:', error)
        });
        this.similarItems = this.furnitureItems
          .filter(item => item.category === this.product.category && item.urlSlug !== this.product.urlSlug)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
      }
    });
  }

  onAddToCart() {
    // Implement add to cart logic
  }
}
