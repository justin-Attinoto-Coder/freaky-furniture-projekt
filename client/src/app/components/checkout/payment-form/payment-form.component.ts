import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="submit.emit($event)">
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-gray-700 font-bold">Payment Method</label>
          <select name="paymentMethod" [(ngModel)]="paymentDetails.paymentMethod" (change)="change.emit($event)" class="w-full p-2 bg-gray-100 rounded-xl">
            <option value="creditCard">Credit Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
        <div>
          <label class="block text-gray-700 font-bold">Card Holder Name</label>
          <input type="text" name="cardHolderName" [(ngModel)]="paymentDetails.cardHolderName" (change)="change.emit($event)" class="w-full p-2 bg-gray-100 rounded-xl" />
        </div>
        <div>
          <label class="block text-gray-700 font-bold">Card Number</label>
          <input type="text" name="cardNumber" [(ngModel)]="paymentDetails.cardNumber" (change)="change.emit($event)" class="w-full p-2 bg-gray-100 rounded-xl" />
        </div>
        <div>
          <label class="block text-gray-700 font-bold">Expiry Date</label>
          <input type="text" name="expiryDate" [(ngModel)]="paymentDetails.expiryDate" (change)="change.emit($event)" class="w-full p-2 bg-gray-100 rounded-xl" />
        </div>
        <div>
          <label class="block text-gray-700 font-bold">CVV</label>
          <input type="text" name="cvv" [(ngModel)]="paymentDetails.cvv" (change)="change.emit($event)" class="w-full p-2 bg-gray-100 rounded-xl" />
        </div>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </div>
    </form>
  `
})
export class PaymentFormComponent {
  @Input() paymentDetails: any = {};
  @Input() shippingDetails: any = {};
  @Output() change = new EventEmitter<Event>();
  @Output() submit = new EventEmitter<Event>();
}
