import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-200 p-8 text-center">
      <h1 class="text-4xl font-bold">Welcome to Freaky Furniture</h1>
      <p class="text-lg mt-4">Discover our unique collection!</p>
    </div>
  `,
  styles: []
})
export class HeroComponent {}
