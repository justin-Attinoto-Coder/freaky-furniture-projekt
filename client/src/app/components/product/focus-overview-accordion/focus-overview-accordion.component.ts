import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewAccordionItemComponent } from './overview-accordion-item/overview-accordion-item.component';

interface Review {
  rating: number;
  reviewText: string;
  reviewerName: string;
}

@Component({
  selector: 'app-focus-overview-accordion',
  standalone: true,
  imports: [CommonModule, OverviewAccordionItemComponent],
  templateUrl: './focus-overview-accordion.component.html',
  styleUrls: ['./focus-overview-accordion.component.css']
})
export class FocusOverviewAccordionComponent {
  @Input({ required: true }) product: any = {};
  @Input() reviews: Review[] = [];
}
