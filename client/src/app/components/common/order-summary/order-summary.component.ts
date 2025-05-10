import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent {
  @Input() subtotal: number = 0;
  @Input() shippingFee: number = 0;
  @Input() grandTotal: number = 0;
  @Input() hideConfirmButton: boolean = false; // New input to hide button
  @Output() confirmOrder = new EventEmitter<void>();

  onConfirmOrder(): void {
    console.log('OrderSummary: Confirm Order button clicked');
    this.confirmOrder.emit();
    console.log('OrderSummary: confirmOrder event emitted');
  }
}