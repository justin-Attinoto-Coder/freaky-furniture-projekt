import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faUser, faShoppingBasket, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '../navbar/navbar.component';
import { HamburgerMenuComponent } from '../hamburger-menu/hamburger-menu.component';
import { CartService, CartItem } from '../../../services/cart.service';
import { SearchService } from '../../../services/search.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule, NavbarComponent, HamburgerMenuComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Cart state
  cartItems: CartItem[] = [];
  totalItemsInCart = 0;

  // Menu state
  isMenuOpen = false;

  // Auth state
  isLoggedIn = false;
  isAdmin = false;
  currentUser: string | null = null;

  // Font Awesome icons
  faHeart = faHeart;
  faUser = faUser;
  faShoppingBasket = faShoppingBasket;
  faCog = faCog;              // Admin gear icon
  faSignOutAlt = faSignOutAlt; // Logout icon

  // Subscriptions
  private authSubscription?: Subscription;
  private cartSubscription?: Subscription;

  constructor(
    private cartService: CartService,
    private searchService: SearchService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to cart changes
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.totalItemsInCart = items.reduce((total, item) => total + item.quantity, 0);
      console.log('cartItems updated in Header:', items);
    });

    // Subscribe to auth state changes
    this.authSubscription = this.authService.authState$.subscribe(authState => {
      this.isLoggedIn = authState.isLoggedIn;
      this.isAdmin = authState.role === 'admin';
      this.currentUser = authState.username;

      console.log('Header auth state updated:', {
        isLoggedIn: this.isLoggedIn,
        isAdmin: this.isAdmin,
        user: this.currentUser
      });
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.cartSubscription?.unsubscribe();
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

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      console.log('🚪 User logging out');
      this.authService.logout();
      this.router.navigate(['/']);
    }
  }
}
