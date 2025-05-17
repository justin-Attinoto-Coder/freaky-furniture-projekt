import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../common/product-card/product-card.component';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-detaljer',
  templateUrl: './detaljer.component.html',
  styleUrls: ['./detaljer.component.css'],
  standalone: true,
  imports: [CommonModule, ProductCardComponent]
})
export class DetaljerComponent {
  @Input({ required: true }) products: Product[] = [];
}
