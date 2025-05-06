import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCcMastercard, faPaypal } from '@fortawesome/free-brands-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons'; // Assuming Google Pay icon

@Component({
  selector: 'app-payment-method-selector',
  templateUrl: './payment-selector.component.html',
  styleUrls: ['./payment-selector.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent]
})
export class PaymentMethodSelectorComponent {
  @Input({ required: true }) paymentDetails!: { paymentMethod: string };
  @Output() change = new EventEmitter<Event>();
  faMastercard = faCcMastercard;
  faPaypal = faPaypal;
  faGoogle = faGoogle;
}
