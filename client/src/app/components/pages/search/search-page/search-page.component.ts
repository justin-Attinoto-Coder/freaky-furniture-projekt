import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultsComponent } from '../../../home/search-results/search-results.component';
import { ModalComponent } from '../../../common/modal/modal.component';
import { Product } from '../../../../models/product';
import { SearchService } from '../../../../services/search.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
  standalone: true,
  imports: [CommonModule, SearchResultsComponent, ModalComponent]
})
export class SearchPageComponent implements OnInit {
  sortOption = 'Namn';
  sortOrder = 'asc';
  filterValue = '';
  filteredResults: Product[] = [];
  searchResults: Product[] = [];
  searchQuery = '';
  searchPerformed = false;
  isSortModalOpen = false;
  isFilterModalOpen = false;

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    console.log('SearchPage: Initializing component');
    this.searchService.searchResults$.subscribe(results => {
      console.log('SearchPage: Received search results:', results);
      this.searchResults = results;
      this.filteredResults = results;
      this.filterResults(this.filterValue);
    });
    this.searchService.searchQuery$.subscribe(query => {
      console.log('SearchPage: Received search query:', query);
      this.searchQuery = query;
    });
    this.searchService.searchPerformed$.subscribe(performed => {
      console.log('SearchPage: Search performed:', performed);
      this.searchPerformed = performed;
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
    const sortKey = sortValue === 'Namn' ? 'name' : sortValue === 'Pris' ? 'price' : sortValue === 'Datum Publiserat' ? 'publishing_date' : '';
    this.sortResults(sortKey, this.sortOrder);
    this.isSortModalOpen = false;
  }

  sortResults(sortKey: string, order: string): void {
    console.log('SearchPage: Sorting results by:', sortKey, 'Order:', order);
    const sortedResults = [...this.filteredResults].sort((a, b) => {
      if (sortKey === 'name') {
        return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sortKey === 'price') {
        return order === 'asc' ? (a.price - b.price) : (b.price - a.price);
      } else if (sortKey === 'publishing_date') {
        return order === 'asc'
          ? (new Date(a.publishing_date || '').getTime() - new Date(b.publishing_date || '').getTime())
          : (new Date(b.publishing_date || '').getTime() - new Date(a.publishing_date || '').getTime());
      }
      return 0;
    });
    this.filteredResults = sortedResults;
  }

  handleFilterChange(filterValue: string): void {
    console.log('SearchPage: Handling filter change:', filterValue);
    this.filterValue = filterValue;
    this.filterResults(filterValue);
    this.isFilterModalOpen = false;
  }

  filterResults(filterValue: string): void {
    console.log('SearchPage: Filtering results by:', filterValue);
    const filtered = this.searchResults.filter(item => {
      return filterValue === '' || item.category === filterValue;
    });
    this.filteredResults = filtered;
  }
}