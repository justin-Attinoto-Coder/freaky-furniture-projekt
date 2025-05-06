import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-header',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="text-center mb-4"><h2 class="text-2xl font-bold">Checkout</h2></div>`
})
export class CheckoutHeaderComponent {
  constructor(private router: Router) {}
}
