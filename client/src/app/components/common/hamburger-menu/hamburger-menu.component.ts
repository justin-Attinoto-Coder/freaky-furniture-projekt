import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hamburger-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.css']
})
export class HamburgerMenuComponent {
  @Input({ required: true }) isMenuOpen!: boolean;
  @Output() toggleMenu = new EventEmitter<void>();

  routes = [
    { name: 'Home', path: '/home' },
    { name: 'Search', path: '/search' },
    { name: 'Cart', path: '/cart' },
    { name: 'Login', path: '/login' },
    { name: 'Admin Dashboard', path: '/admin/table' },
    { name: 'Manage Products', path: '/admin/table' },
    { name: 'Add New Product', path: '/admin/new-product' },
    { name: 'Manage Users', path: '/admin/users' },
    { name: 'User Dashboard', path: '/user/dashboard' },
    { name: 'Checkout Shipping', path: '/checkout-shipping' },
    { name: 'Checkout Payment', path: '/checkout-payment' },
    { name: 'Checkout Review', path: '/checkout-review' },
    { name: 'Checkout Confirmation', path: '/checkout-confirmation' }
  ];

  toggle(): void {
    this.toggleMenu.emit();
  }
}
