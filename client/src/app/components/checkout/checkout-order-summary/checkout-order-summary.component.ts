import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-order-summary',
  templateUrl: './checkout-order-summary.component.html',
  styleUrls: ['./checkout-order-summary.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CheckoutOrderSummaryComponent {
  @Input({ required: true }) subtotal!: number;
  @Input({ required: true }) shippingFee!: number;
  @Input({ required: true }) grandTotal!: number;
  @Output() confirmOrder = new EventEmitter<void>();
}
