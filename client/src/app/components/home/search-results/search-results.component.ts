import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold">Search Results</h2>
      <!-- Add search results logic -->
    </div>
  `,
  styles: []
})
export class SearchResultsComponent {}
