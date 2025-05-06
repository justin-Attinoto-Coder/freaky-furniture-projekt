import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HamburgerMenuComponent {
  @Input({ required: true }) isMenuOpen!: boolean;
  @Output() toggleMenu = new EventEmitter<void>();
  categories = ['mobler', 'forvaring', 'detaljer', 'textil'];
  additionalLinks = [
    { name: 'Mina sidor', href: '#mina-sidor' },
    { name: 'Kontakta oss', href: '#kontakta-oss' },
    { name: 'Social Media', href: '#footer' }
  ];

  constructor(private router: Router) {}

  handleCategoryClick(category: string): void {
    this.toggleMenu.emit();
    this.router.navigate([], { fragment: category });
  }

  handleLinkClick(href: string): void {
    this.toggleMenu.emit();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
