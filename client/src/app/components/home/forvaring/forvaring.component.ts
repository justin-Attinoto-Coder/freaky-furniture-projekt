// src/app/components/home/forvaring/forvaring.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf, ngFor, etc.
import { ProductCardComponent } from '../../common/product-card/product-card.component';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-forvaring',
  templateUrl: './forvaring.component.html',
  styleUrls: ['./forvaring.component.css'],
  standalone: true,
  imports: [CommonModule, ProductCardComponent]
})
export class ForvaringComponent {
  @Input({ required: true }) products: Product[] = [];
}
