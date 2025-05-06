import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // Ensure FontAwesomeModule
import { faHeart, faUser, faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '../navbar/navbar.component';
import { HamburgerMenuComponent } from '../hamburger-menu/hamburger-menu.component';
import { CartService, CartItem } from '../../../services/cart.service';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule, NavbarComponent, HamburgerMenuComponent]
})
export class HeaderComponent implements OnInit {
  @Input() cartItems: CartItem[] = []; // Add cartItems input
  @Input() handleSearch!: (query: string) => void; // Add handleSearch input
  isMenuOpen = false;
  totalItemsInCart = 0;
  faHeart = faHeart;
  faUser = faUser;
  faShoppingBasket = faShoppingBasket;

  constructor(private cartService: CartService, private searchService: SearchService) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.totalItemsInCart = items.reduce((total, item) => total + item.quantity, 0);
      console.log('cartItems updated in Header:', items);
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    console.log('isMenuOpen:', this.isMenuOpen); // Debug
  }
}
