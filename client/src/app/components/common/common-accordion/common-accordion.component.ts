// src/app/components/common/common-accordion/common-accordion.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommonAccordionItemComponent } from '../common-accordion-item/common-accordion-item.component';

@Component({
  selector: 'app-common-accordion',
  templateUrl: './common-accordion.component.html',
  styleUrls: ['./common-accordion.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, CommonAccordionItemComponent]
})
export class CommonAccordionComponent {}
