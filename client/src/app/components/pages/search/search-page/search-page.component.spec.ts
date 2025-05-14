import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchPageComponent } from './search-page.component';
import { SearchService } from '../../../../services/search.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../../../models/product';
import { Component } from '@angular/core';

// Mock SearchResultsComponent
@Component({
  selector: 'app-search-results',
  template: '',
  standalone: true
})
class MockSearchResultsComponent {
  results: Product[] = [];
  searchPerformed: boolean = false;
}

// Mock ModalComponent
@Component({
  selector: 'app-modal',
  template: '',
  standalone: true
})
class MockModalComponent {
  isOpen: boolean = false;
  close = () => {};
}

// Mock CommonAccordionComponent
@Component({
  selector: 'app-common-accordion',
  template: '',
  standalone: true
})
class MockCommonAccordionComponent {}

describe('SearchPageComponent', () => {
  let component: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;
  let mockSearchService: Partial<SearchService>;
  let searchResultsSubject: BehaviorSubject<Product[]>;
  let searchQuerySubject: BehaviorSubject<string>;
  let searchPerformedSubject: BehaviorSubject<boolean>;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Table',
      brand: 'Brand A',
      price: 100,
      publishing_date: '2023-01-01',
      urlSlug: 'table',
      category: 'mobler',
      image: 'https://freaky-angular-furniture-backend.onrender.com/images/table.jpg'
    },
    {
      id: 2,
      name: 'Chair',
      brand: 'Brand B',
      price: 50,
      publishing_date: '2023-02-01',
      urlSlug: 'chair',
      category: 'mobler',
      image: 'https://freaky-angular-furniture-backend.onrender.com/images/chair.jpg'
    },
    {
      id: 3,
      name: 'Lamp',
      brand: 'Brand C',
      price: 75,
      publishing_date: '2023-03-01',
      urlSlug: 'lamp',
      category: 'detaljer',
      image: 'https://freaky-angular-furniture-backend.onrender.com/images/lamp.jpg'
    }
  ];

  beforeEach(async () => {
    searchResultsSubject = new BehaviorSubject<Product[]>([]);
    searchQuerySubject = new BehaviorSubject<string>('');
    searchPerformedSubject = new BehaviorSubject<boolean>(false);

    mockSearchService = {
      searchResults$: searchResultsSubject.asObservable(),
      searchQuery$: searchQuerySubject.asObservable(),
      searchPerformed$: searchPerformedSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        SearchPageComponent,
        MockSearchResultsComponent,
        MockModalComponent,
        MockCommonAccordionComponent
      ],
      providers: [
        { provide: SearchService, useValue: mockSearchService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.sortOption).toBe('Namn');
    expect(component.sortOrder).toBe('asc');
    expect(component.filterValue).toBe('');
    expect(component.filteredResults).toEqual([]);
    expect(component.searchResults).toEqual([]);
    expect(component.searchQuery).toBe('');
    expect(component.searchPerformed).toBeFalse();
    expect(component.isSortModalOpen).toBeFalse();
    expect(component.isFilterModalOpen).toBeFalse();
  });

  it('should render common-accordion component', () => {
    const accordionElement = fixture.debugElement.query(By.css('app-common-accordion'));
    expect(accordionElement).toBeTruthy();
  });

  it('should update searchResults and filteredResults when searchResults$ emits', () => {
    searchResultsSubject.next(mockProducts);
    searchPerformedSubject.next(true);
    fixture.detectChanges();
    expect(component.searchResults).toEqual(mockProducts);
    expect(component.filteredResults).toEqual(mockProducts);
    expect(component.searchPerformed).toBeTrue();
  });

  it('should update searchQuery when searchQuery$ emits', () => {
    searchQuerySubject.next('table');
    fixture.detectChanges();
    expect(component.searchQuery).toBe('table');
  });

  it('should handle empty search results', () => {
    searchResultsSubject.next([]);
    searchPerformedSubject.next(true);
    fixture.detectChanges();
    expect(component.searchResults).toEqual([]);
    expect(component.filteredResults).toEqual([]);
    expect(component.searchPerformed).toBeTrue();
  });

  describe('handleSortChange', () => {
    beforeEach(() => {
      component.searchResults = [...mockProducts];
      component.filteredResults = [...mockProducts];
      searchPerformedSubject.next(true);
      fixture.detectChanges();
    });

    it('should toggle sortOrder if same sortOption is selected', () => {
      component.sortOption = 'Namn';
      component.sortOrder = 'asc';
      component.handleSortChange('Namn');
      expect(component.sortOrder).toBe('desc');
      expect(component.isSortModalOpen).toBeFalse();
    });

    it('should set sortOption and reset sortOrder to asc if different sortOption', () => {
      component.sortOption = 'Namn';
      component.sortOrder = 'desc';
      component.handleSortChange('Pris');
      expect(component.sortOption).toBe('Pris');
      expect(component.sortOrder).toBe('asc');
      expect(component.isSortModalOpen).toBeFalse();
    });

    it('should sort by name ascending', () => {
      component.handleSortChange('Namn');
      expect(component.filteredResults[0].name).toBe('Chair');
      expect(component.filteredResults[1].name).toBe('Lamp');
      expect(component.filteredResults[2].name).toBe('Table');
    });

    it('should sort by name descending', () => {
      component.handleSortChange('Namn');
      component.handleSortChange('Namn');
      expect(component.filteredResults[0].name).toBe('Table');
      expect(component.filteredResults[1].name).toBe('Lamp');
      expect(component.filteredResults[2].name).toBe('Chair');
    });

    it('should sort by price ascending', () => {
      component.handleSortChange('Pris');
      expect(component.filteredResults[0].price).toBe(50);
      expect(component.filteredResults[1].price).toBe(75);
      expect(component.filteredResults[2].price).toBe(100);
    });

    it('should sort by publishing_date ascending', () => {
      component.handleSortChange('Datum Publiserat');
      expect(component.filteredResults[0].publishing_date).toBe('2023-01-01');
      expect(component.filteredResults[1].publishing_date).toBe('2023-02-01');
      expect(component.filteredResults[2].publishing_date).toBe('2023-03-01');
    });
  });

  describe('handleFilterChange', () => {
    beforeEach(() => {
      component.searchResults = [...mockProducts];
      component.filteredResults = [...mockProducts];
      searchPerformedSubject.next(true);
      fixture.detectChanges();
    });

    it('should filter by category', () => {
      component.handleFilterChange('mobler');
      expect(component.filterValue).toBe('mobler');
      expect(component.filteredResults.length).toBe(2);
      expect(component.filteredResults.every(product => product.category === 'mobler')).toBeTrue();
      expect(component.isFilterModalOpen).toBeFalse();
    });

    it('should show all results when filter is cleared', () => {
      component.handleFilterChange('');
      expect(component.filterValue).toBe('');
      expect(component.filteredResults.length).toBe(3);
      expect(component.filteredResults).toEqual(mockProducts);
    });
  });
});
