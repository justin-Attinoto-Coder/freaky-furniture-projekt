import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../common/product-card/product-card.component';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-textil',
  templateUrl: './textil.component.html',
  styleUrls: ['./textil.component.css'],
  standalone: true,
  imports: [CommonModule, ProductCardComponent]
})
export class TextilComponent {
  @Input({ required: true }) products: Product[] = [];
}
