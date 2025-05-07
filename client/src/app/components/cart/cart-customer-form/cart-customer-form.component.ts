import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerData } from '../../../services/cart.service';

@Component({
  selector: 'app-cart-customer-form',
  templateUrl: './cart-customer-form.component.html',
  styleUrls: ['./cart-customer-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CartCustomerFormComponent {
  @Input({ required: true }) formData!: CustomerData;
  @Input({ required: true }) total!: number;
  @Output() change = new EventEmitter<Event>();

  provinces = [
    "Stockholm", "Västra Götaland", "Skåne", "Uppsala", "Södermanland", "Östergötland",
    "Jönköping", "Kronoberg", "Kalmar", "Gotland", "Blekinge", "Halland", "Värmland",
    "Örebro", "Västmanland", "Dalarna", "Gävleborg", "Västernorrland", "Jämtland",
    "Västerbotten", "Norrbotten"
  ];

  cities = [
    "Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping",
    "Helsingborg", "Jönköping", "Norrköping", "Lund", "Umeå", "Gävle", "Borås",
    "Södertälje", "Eskilstuna", "Karlstad", "Täby", "Växjö", "Halmstad"
  ];
}
