import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../common/product-card/product-card.component';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-mobler',
  templateUrl: './mobler.component.html',
  styleUrls: ['./mobler.component.css'],
  standalone: true,
  imports: [CommonModule, ProductCardComponent]
})
export class MoblerComponent {
  @Input({ required: true }) products: Product[] = [];
}
