import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faUser, faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '../navbar/navbar.component';
import { HamburgerMenuComponent } from '../hamburger-menu/hamburger-menu.component';
import { CartService, CartItem } from '../../../services/cart.service';
import { SearchService } from '../../../services/search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule, NavbarComponent, HamburgerMenuComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartItems: CartItem[] = [];
  isMenuOpen = false;
  totalItemsInCart = 0;
  faHeart = faHeart;
  faUser = faUser;
  faShoppingBasket = faShoppingBasket;

  constructor(private cartService: CartService, private searchService: SearchService, private router: Router) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.totalItemsInCart = items.reduce((total, item) => total + item.quantity, 0);
      console.log('cartItems updated in Header:', items);
    });
  }

  handleSearch(query: string): void {
    console.log('Header: Handling search query:', query);
    this.searchService.search(query);
    this.router.navigate(['/search']).then(success => {
      console.log('Header: Navigation to /search successful:', success);
    }).catch(error => {
      console.error('Header: Navigation to /search failed:', error);
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    console.log('isMenuOpen:', this.isMenuOpen);
  }
}