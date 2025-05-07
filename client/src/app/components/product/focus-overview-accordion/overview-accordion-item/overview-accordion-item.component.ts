import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview-accordion-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border-b" [ngClass]="customClass">
      <button
        class="w-full text-left p-4 focus:outline-none"
        [ngClass]="customClass"
        (click)="toggleAccordion()"
      >
        <div class="flex justify-between items-center">
          <span>{{ title }}</span>
          <span>{{ isOpen ? '-' : '+' }}</span>
        </div>
      </button>
      <div *ngIf="isOpen" class="p-4 bg-white max-h-40 overflow-y-auto">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: []
})
export class OverviewAccordionItemComponent {
  @Input({ required: true }) title: string = '';
  @Input() customClass: string = '';
  isOpen: boolean = false;

  toggleAccordion(): void {
    this.isOpen = !this.isOpen;
  }
}
