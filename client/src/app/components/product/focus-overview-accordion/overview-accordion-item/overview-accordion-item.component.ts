import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview-accordion-item',
  templateUrl: './overview-accordion-item.component.html',
  styleUrls: ['./overview-accordion-item.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class OverviewAccordionItemComponent {
  @Input({ required: true }) title!: string;
  @Input() customClass: string = '';
  isOpen = false;

  toggleAccordion(): void {
    this.isOpen = !this.isOpen;
  }
}
