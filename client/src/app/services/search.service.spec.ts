import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SearchService } from './search.service';
import { AuthService } from './auth.service';
import { Product } from '../models/product';

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SearchService,
        { provide: AuthService, useValue: spy }
      ]
    });

    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search for products', () => {
    const mockSearchResults: Product[] = [
      {
        id: 1,
        name: 'Modern Sofa',
        description: 'A comfortable modern sofa',
        price: 999.99,
        category: 'Living Room',
        brand: 'IKEA',
        image: '/images/sofa.jpg',
        urlSlug: 'modern-sofa',
        stock: 5
      }
    ];

    authServiceSpy.getToken.and.returnValue('mock-token');

    service.search('sofa');

    service.searchResults$.subscribe(results => {
      expect(results).toEqual(mockSearchResults);
    });

    service.searchPerformed$.subscribe(performed => {
      expect(performed).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:5186/api/products?query=sofa');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockSearchResults);
  });

  it('should clear search results', () => {
    service.clearSearch();

    service.searchResults$.subscribe(results => {
      expect(results).toEqual([]);
    });

    service.searchPerformed$.subscribe(performed => {
      expect(performed).toBe(false);
    });

    service.searchQuery$.subscribe(query => {
      expect(query).toBe('');
    });
  });

  it('should handle empty search query', () => {
    service.search('');

    service.searchResults$.subscribe(results => {
      expect(results).toEqual([]);
    });

    service.searchPerformed$.subscribe(performed => {
      expect(performed).toBe(false);
    });

    // No HTTP request should be made for empty query
    httpMock.expectNone('http://localhost:5186/api/products');
  });

  it('should handle search errors', () => {
    authServiceSpy.getToken.and.returnValue('mock-token');

    service.search('test');

    service.searchResults$.subscribe(results => {
      expect(results).toEqual([]);
    });

    service.searchPerformed$.subscribe(performed => {
      expect(performed).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:5186/api/products?query=test');
    req.error(new ProgressEvent('Network error'));
  });
});
