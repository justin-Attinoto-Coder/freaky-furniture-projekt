import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultsComponent } from '../../../home/search-results/search-results.component';
import { ModalComponent } from '../../../common/modal/modal.component';
import { Product } from '../../../../models/product';
import { SearchService } from '../../../../services/search.service';
import { CommonAccordionComponent} from '../../../common/common-accordion/common-accordion.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
  standalone: true,
  imports: [CommonModule, SearchResultsComponent, ModalComponent, CommonAccordionComponent]
})
export class SearchPageComponent implements OnInit, OnDestroy {
  sortOption = 'Namn';
  sortOrder = 'asc';
  filterValue = '';
  filteredResults: Product[] = [];
  searchResults: Product[] = [];
  searchQuery = '';
  searchPerformed = false;
  isSortModalOpen = false;
  isFilterModalOpen = false;

  private subscriptions = new Subscription();

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    console.log('SearchPage: Initializing component');

    // Combine subscriptions to avoid potential loops
    this.subscriptions.add(
      this.searchService.searchResults$.subscribe(results => {
        console.log('SearchPage: Received search results:', results);
        this.searchResults = results;
        this.applyFiltersAndSort();
      })
    );

    this.subscriptions.add(
      this.searchService.searchQuery$.subscribe(query => {
        console.log('SearchPage: Received search query:', query);
        this.searchQuery = query;
      })
    );

    this.subscriptions.add(
      this.searchService.searchPerformed$.subscribe(performed => {
        console.log('SearchPage: Search performed:', performed);
        this.searchPerformed = performed;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private applyFiltersAndSort(): void {
    // First filter
    const filtered = this.searchResults.filter(item => {
      return this.filterValue === '' || item.categoryName === this.filterValue;
    });

    // Then sort
    if (this.sortOption) {
      const sortKey = this.sortOption === 'Namn' ? 'name' :
                     this.sortOption === 'Pris' ? 'price' :
                     this.sortOption === 'Datum Publiserat' ? 'publishingDate' : '';

      if (sortKey) {
        this.filteredResults = this.sortArray(filtered, sortKey, this.sortOrder);
      } else {
        this.filteredResults = filtered;
      }
    } else {
      this.filteredResults = filtered;
    }
  }

  private sortArray(array: Product[], sortKey: string, order: string): Product[] {
    return [...array].sort((a, b) => {
      if (sortKey === 'name') {
        return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sortKey === 'price') {
        return order === 'asc' ? (a.price - b.price) : (b.price - a.price);
      } else if (sortKey === 'publishingDate') {
        return order === 'asc'
          ? (new Date(a.publishingDate || '').getTime() - new Date(b.publishingDate || '').getTime())
          : (new Date(b.publishingDate || '').getTime() - new Date(a.publishingDate || '').getTime());
      }
      return 0;
    });
  }

  handleSortChange(sortValue: string): void {
    console.log('SearchPage: Handling sort change:', sortValue);
    if (this.sortOption === sortValue) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortOption = sortValue;
      this.sortOrder = 'asc';
    }
    this.applyFiltersAndSort();
    this.isSortModalOpen = false;
  }

  handleFilterChange(filterValue: string): void {
    console.log('SearchPage: Handling filter change:', filterValue);
    this.filterValue = filterValue;
    this.applyFiltersAndSort();
    this.isFilterModalOpen = false;
  }

  // Remove the separate sortResults and filterResults methods as they're now combined
}
