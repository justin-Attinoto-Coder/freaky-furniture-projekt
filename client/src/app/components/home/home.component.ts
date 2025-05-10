// src/app/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeroComponent } from './hero/hero.component';
import { MoblerComponent } from './mobler/mobler.component';
import { ForvaringComponent } from './forvaring/forvaring.component';
import { DetaljerComponent } from './detaljer/detaljer.component';
import { TextilComponent } from './textil/textil.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { SearchService } from '../../services/search.service';
import { CommonAccordionComponent } from '../common/common-accordion/common-accordion.component';

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
export class HomeComponent implements OnInit {
  furnitureItems: Product[] = [];
  recentProducts: Product[] = [];
  moblerProducts: Product[] = [];
  forvaringProducts: Product[] = [];
  detaljerProducts: Product[] = [];
  textilProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.productService.getFurnitureItems().subscribe(items => {
      this.furnitureItems = items;
      this.recentProducts = this.getRandomProducts(this.filterRecentProducts(this.furnitureItems), 4);
      this.moblerProducts = this.getRandomProducts(this.filterByCategory(this.furnitureItems, 'mobler'), 4);
      this.forvaringProducts = this.getRandomProducts(this.filterByCategory(this.furnitureItems, 'forvaring'), 4);
      this.detaljerProducts = this.getRandomProducts(this.filterByCategory(this.furnitureItems, 'detaljer'), 4);
      this.textilProducts = this.getRandomProducts(this.filterByCategory(this.furnitureItems, 'textil'), 4);
    });

    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  private filterRecentProducts(products: Product[]): Product[] {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return products.filter(product => new Date(product.publishing_date || '') >= sevenDaysAgo);
  }

  private filterByCategory(products: Product[], category: string): Product[] {
    return products.filter(product => product.category?.toLowerCase() === category.toLowerCase());
  }

  private getRandomProducts(products: Product[], limit: number): Product[] {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  }
}
