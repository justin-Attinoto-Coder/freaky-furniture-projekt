import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hamburger-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hamburger-menu.component.html',
  styleUrls: []
})
export class HamburgerMenuComponent {
  @Input({ required: true }) isMenuOpen!: boolean;
  @Output() toggleMenu = new EventEmitter<void>();

  routes = [
    { name: 'Home', path: '/home' },
    { name: 'Search', path: '/search' },
    { name: 'Product', path: '/product/vauv-cofajfik-toure' },
    { name: 'Cart', path: '/cart' },
    { name: 'Login', path: '/login' },
    { name: 'Admin Dashboard', path: '/admin/dashboard' },
    { name: 'Admin Table', path: '/admin/table' },
    { name: 'Admin New Product', path: '/admin/new-product' },
    { name: 'Admin Users', path: '/admin/users' },
    { name: 'User Dashboard', path: '/user/dashboard' },
    { name: 'Checkout Shipping', path: '/checkout/shipping' },
    { name: 'Checkout Payment', path: '/checkout/payment' },
    { name: 'Checkout Review', path: '/checkout/review' }
  ];

  toggle(): void {
    this.toggleMenu.emit();
  }
}