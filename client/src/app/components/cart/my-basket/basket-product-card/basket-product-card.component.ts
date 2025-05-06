// src/app/components/cart/basket-product-card/basket-product-card.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../../../services/cart.service';

@Component({
  selector: 'app-basket-product-card',
  templateUrl: './basket-product-card.component.html',
  styleUrls: ['./basket-product-card.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class BasketProductCardComponent {
  @Input({ required: true }) item!: CartItem;
  @Output() updateCartItem = new EventEmitter<{ productId: number; quantity: number }>();
  @Output() deleteCartItem = new EventEmitter<number>();

  handleQuantityChange(amount: number): void {
    const newQuantity = Math.max(1, this.item.quantity + amount);
    this.updateCartItem.emit({ productId: this.item.productId, quantity: newQuantity });
  }
}
