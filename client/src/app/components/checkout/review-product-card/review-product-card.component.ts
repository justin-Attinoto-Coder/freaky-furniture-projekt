import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-product-card.component.html',
  styleUrls: ['./review-product-card.component.css']
})
export class ReviewProductCardComponent {
  @Input() product: any = {};
  @Output() quantityChange = new EventEmitter<number>();

  handleQuantityChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const newQuantity = parseInt(input.value, 10);
    if (!isNaN(newQuantity)) {
      this.quantityChange.emit(newQuantity);
    }
  }
}
