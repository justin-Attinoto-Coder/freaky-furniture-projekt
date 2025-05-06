import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/common/header/header.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { CartService, CartItem } from './services/cart.service';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService, private searchService: SearchService) {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  handleSearch(query: string): void {
    this.searchService.search(query);
  }
}
