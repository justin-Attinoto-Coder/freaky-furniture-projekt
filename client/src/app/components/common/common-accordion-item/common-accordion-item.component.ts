// src/app/components/common/common-accordion-item/common-accordion-item.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Add RouterModule

@Component({
  selector: 'app-common-accordion-item',
  templateUrl: './common-accordion-item.component.html',
  styleUrls: ['./common-accordion-item.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule] // Add RouterModule here
})
export class CommonAccordionItemComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) id!: string;
  @Input() customClass: string = '';
  isOpen = false;

  toggleAccordion(): void {
    this.isOpen = !this.isOpen;
  }
}
