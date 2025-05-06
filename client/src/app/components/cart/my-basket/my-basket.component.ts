// src/app/components/cart/my-basket/my-basket.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketProductCardComponent } from './basket-product-card/basket-product-card.component';
import { CartItem } from '../../../services/cart.service';

@Component({
  selector: 'app-my-basket',
  templateUrl: './my-basket.component.html',
  styleUrls: ['./my-basket.component.css'],
  standalone: true,
  imports: [CommonModule, BasketProductCardComponent]
})
export class MyBasketComponent {
  @Input({ required: true }) cartItems!: CartItem[];
  @Output() updateCartItem = new EventEmitter<{ productId: number; quantity: number }>();
  @Output() deleteCartItem = new EventEmitter<number>();
}
