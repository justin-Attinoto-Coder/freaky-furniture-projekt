import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../common/product-card/product-card.component';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {
  @Input() results: Product[] = [];
  @Input() searchPerformed: boolean = false;

  ngOnChanges() {
    console.log('SearchResults: Received results:', this.results, 'Search performed:', this.searchPerformed);
  }
}
