import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SearchService } from './search.service';
import { AuthService } from './auth.service';
import { Product } from '../models/product';

// Mock AuthService
class MockAuthService {
  getToken(): string | null {
    return 'mock-token';
  }
}

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SearchService,
        { provide: AuthService, useClass: MockAuthService }
      ]
    });
    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have searchResults$ observable', () => {
    expect(service.searchResults$).toBeDefined();
  });

  it('should have searchPerformed$ observable', () => {
    expect(service.searchPerformed$).toBeDefined();
  });

  it('should have searchQuery$ observable', () => {
    expect(service.searchQuery$).toBeDefined();
  });

  it('should clear search results', () => {
    service.clearSearch();

    service.searchResults$.subscribe(results => {
      expect(results.length).toBe(0);
    });

    service.searchPerformed$.subscribe(performed => {
      expect(performed).toBeFalse();
    });

    service.searchQuery$.subscribe(query => {
      expect(query).toBe('');
    });
  });

  it('should perform search and update observables', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Test Chair',
        description: 'A comfortable test chair',
        price: 999.99,
        image: '/test-chair.jpg',
        brand: 'Test Brand',
        urlSlug: 'test-chair',
        sku: 'TST001',
        categoryId: 1,
        categoryName: 'Möbler',
        publishingDate: new Date()
      }
    ];

    const searchQuery = 'chair';

    // Call the search method (it only takes 1 argument: query)
    service.search(searchQuery);

    // Expect HTTP request to be made
    const req = httpMock.expectOne(
      `https://freaky-angular-furniture-backend.onrender.com/api/furniture?query=${encodeURIComponent(searchQuery)}`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');

    // Respond with mock data
    req.flush(mockProducts);

    // Verify observables are updated
    service.searchResults$.subscribe(results => {
      expect(results).toEqual(mockProducts);
    });

    service.searchPerformed$.subscribe(performed => {
      expect(performed).toBeTrue();
    });

    service.searchQuery$.subscribe(query => {
      expect(query).toBe(searchQuery);
    });
  });

  it('should handle search error', () => {
    const searchQuery = 'nonexistent';

    service.search(searchQuery);

    const req = httpMock.expectOne(
      `https://freaky-angular-furniture-backend.onrender.com/api/furniture?query=${encodeURIComponent(searchQuery)}`
    );

    // Simulate HTTP error
    req.error(new ErrorEvent('Network error'));

    // Verify error handling
    service.searchResults$.subscribe(results => {
      expect(results).toEqual([]);
    });

    service.searchPerformed$.subscribe(performed => {
      expect(performed).toBeTrue();
    });
  });

  it('should handle empty query', () => {
    service.search('');

    // No HTTP request should be made for empty query
    httpMock.expectNone(() => true);

    // Verify empty results
    service.searchResults$.subscribe(results => {
      expect(results).toEqual([]);
    });

    service.searchPerformed$.subscribe(performed => {
      expect(performed).toBeFalse();
    });
  });

  it('should handle whitespace-only query', () => {
    service.search('   ');

    // No HTTP request should be made for whitespace-only query
    httpMock.expectNone(() => true);

    // Verify empty results
    service.searchResults$.subscribe(results => {
      expect(results).toEqual([]);
    });

    service.searchPerformed$.subscribe(performed => {
      expect(performed).toBeFalse();
    });
  });
});
