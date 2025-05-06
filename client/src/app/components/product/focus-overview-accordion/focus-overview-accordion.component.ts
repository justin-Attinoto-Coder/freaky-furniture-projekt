import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewAccordionItemComponent } from './overview-accordion-item/overview-accordion-item.component';
import { Product } from '../../../models/product';

interface Review {
  rating: number;
  reviewText: string;
  reviewerName: string;
}

@Component({
  selector: 'app-focus-overview-accordion',
  templateUrl: './focus-overview-accordion.component.html',
  styleUrls: ['./focus-overview-accordion.component.css'],
  standalone: true,
  imports: [CommonModule, OverviewAccordionItemComponent]
})
export class FocusOverviewAccordionComponent {
  @Input({ required: true }) product!: Product;
  @Input() reviews: Review[] = [];
}
