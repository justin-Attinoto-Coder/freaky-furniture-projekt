import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center space-x-4 p-4 border-b">
      <img [src]="item.imageURL" [alt]="item.name" class="w-16 h-16 object-cover rounded">

      <div class="flex-1">
        <h3 class="font-semibold">{{ item.name }}</h3>
        <p class="text-gray-600">{{ item.brand }}</p>
        <p class="text-lg font-bold">{{ item.price | currency }}</p>
      </div>

      <div class="flex items-center space-x-2">
        <button
          (click)="decreaseQuantity()"
          class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          [disabled]="item.quantity <= 1">
          -
        </button>
        <span class="px-3 py-1 bg-gray-100 rounded">{{ item.quantity }}</span>
        <button
          (click)="increaseQuantity()"
          class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
          +
        </button>
      </div>

      <button
        (click)="removeItem()"
        class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
        Remove
      </button>
    </div>
  `,
  styles: []
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChange = new EventEmitter<{ productId: number; quantity: number }>();
  @Output() deleteCartItem = new EventEmitter<number>();

  increaseQuantity(): void {
    this.quantityChange.emit({
      productId: this.item.productId,
      quantity: this.item.quantity + 1
    });
  }

  decreaseQuantity(): void {
    if (this.item.quantity > 1) {
      this.quantityChange.emit({
        productId: this.item.productId,
        quantity: this.item.quantity - 1
      });
    }
  }

  removeItem(): void {
    this.deleteCartItem.emit(this.item.productId);
  }
}
