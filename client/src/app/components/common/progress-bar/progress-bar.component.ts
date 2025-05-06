import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="flex justify-between mb-8"><span>Shipping</span><span>Payment</span><span>Review</span></div>`
})
export class ProgressBarComponent {}
