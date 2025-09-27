// src/app/components/home/home.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { HeroComponent } from './hero/hero.component';
import { MoblerComponent } from './mobler/mobler.component';
import { ForvaringComponent } from './forvaring/forvaring.component';
import { DetaljerComponent } from './detaljer/detaljer.component';
import { TextilComponent } from './textil/textil.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { CommonAccordionComponent } from '../common/common-accordion/common-accordion.component';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    MoblerComponent,
    ForvaringComponent,
    DetaljerComponent,
    TextilComponent,
    SearchResultsComponent,
    CommonAccordionComponent
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  // Product arrays
  furnitureItems: Product[] = [];
  recentProducts: Product[] = [];
  moblerProducts: Product[] = [];
  forvaringProducts: Product[] = [];
  detaljerProducts: Product[] = [];
  textilProducts: Product[] = [];

  // UI state
  isLoading = true;
  error: string | null = null;
  showSearchResults = false;

  // Subscriptions
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.setupFragmentScrolling();
    this.setupSearchResultsVisibility();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadProducts(): void {
    this.isLoading = true;
    this.error = null;

    const productSub = this.productService.getFurnitureItems()
      .pipe(
        catchError(error => {
          console.error('❌ Error loading products:', error);
          this.error = 'Failed to load products. Please try again later.';
          return of([]); // Return empty array on error
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(items => {
        console.log('✅ Products loaded:', items.length);
        this.furnitureItems = items;
        this.categorizeProducts();
      });

    this.subscriptions.add(productSub);
  }

  private categorizeProducts(): void {
    if (this.furnitureItems.length === 0) {
      console.warn('⚠️ No products available for categorization');
      return;
    }

    // Get recent products (last 30 days instead of 7 for more results)
    this.recentProducts = this.getRandomProducts(
      this.filterRecentProducts(this.furnitureItems, 30), 4
    );

    // Categorize products
    this.moblerProducts = this.getRandomProducts(
      this.filterByCategory(this.furnitureItems, 'mobler'), 4
    );

    this.forvaringProducts = this.getRandomProducts(
      this.filterByCategory(this.furnitureItems, 'forvaring'), 4
    );

    this.detaljerProducts = this.getRandomProducts(
      this.filterByCategory(this.furnitureItems, 'detaljer'), 4
    );

    this.textilProducts = this.getRandomProducts(
      this.filterByCategory(this.furnitureItems, 'textil'), 4
    );

    // Log category results
    console.log('📊 Products by category:', {
      total: this.furnitureItems.length,
      recent: this.recentProducts.length,
      mobler: this.moblerProducts.length,
      forvaring: this.forvaringProducts.length,
      detaljer: this.detaljerProducts.length,
      textil: this.textilProducts.length
    });
  }

  private setupFragmentScrolling(): void {
    const fragmentSub = this.route.fragment.subscribe(fragment => {
      if (fragment) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            console.log(`🔗 Scrolled to section: ${fragment}`);
          } else {
            console.warn(`⚠️ Element with id '${fragment}' not found`);
          }
        }, 100);
      }
    });

    this.subscriptions.add(fragmentSub);
  }

  private setupSearchResultsVisibility(): void {
    const searchSub = this.searchService.searchResults$.subscribe(results => {
      this.showSearchResults = results.length > 0;
      console.log('🔍 Search results visibility:', this.showSearchResults);
    });

    this.subscriptions.add(searchSub);
  }

  private filterRecentProducts(products: Product[], days: number = 30): Product[] {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);

    const recentProducts = products.filter(product => {
      if (!product.publishing_date) return false;
      const publishDate = new Date(product.publishing_date);
      return publishDate >= daysAgo;
    });

    // If no recent products, return newest products based on ID or date
    if (recentProducts.length === 0) {
      console.log('📅 No recent products found, returning newest items');
      return products
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, 8); // Get more for random selection
    }

    return recentProducts;
  }

  private filterByCategory(products: Product[], category: string): Product[] {
    const filtered = products.filter(product =>
      product.category?.toLowerCase().includes(category.toLowerCase()) ||
      product.name?.toLowerCase().includes(category.toLowerCase())
    );

    if (filtered.length === 0) {
      console.warn(`⚠️ No products found for category: ${category}`);
    }

    return filtered;
  }

  private getRandomProducts(products: Product[], limit: number): Product[] {
    if (products.length === 0) return [];

    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(limit, products.length));
  }

  // Public method to retry loading products
  retryLoading(): void {
    console.log('🔄 Retrying product load...');
    this.loadProducts();
  }

  // Method to refresh products
  refreshProducts(): void {
    console.log('🔄 Refreshing products...');
    this.loadProducts();
  }
}
