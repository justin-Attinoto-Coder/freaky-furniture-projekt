import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { AuthService } from './auth.service';
import { Product } from '../models/product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductService,
        { provide: AuthService, useValue: spy }
      ]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch furniture items', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Modern Sofa',
        description: 'A comfortable modern sofa',
        price: 999.99,
        category: 'Living Room',
        brand: 'IKEA',
        image: '/images/sofa.jpg', // Correct property name
        urlSlug: 'modern-sofa',
        stock: 5
      },
      {
        id: 2,
        name: 'Office Chair',
        description: 'Ergonomic office chair',
        price: 299.99,
        category: 'Office',
        brand: 'IKEA',
        image: '/images/chair.jpg', // Correct property name
        urlSlug: 'office-chair',
        stock: 10
      }
    ];

    authServiceSpy.getToken.and.returnValue('mock-token');

    service.getFurnitureItems().subscribe(products => {
      expect(products).toEqual(mockProducts);
      expect(products.length).toBe(2);
    });

    const req = httpMock.expectOne('http://localhost:5186/api/products');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockProducts);
  });

  it('should fetch products by category', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Modern Sofa',
        description: 'A comfortable modern sofa',
        price: 999.99,
        category: 'Living Room',
        brand: 'IKEA',
        image: '/images/sofa.jpg', // Correct property name
        urlSlug: 'modern-sofa',
        stock: 5
      }
    ];

    authServiceSpy.getToken.and.returnValue('mock-token');

    service.getProducts('Living Room').subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://localhost:5186/api/products?category=Living Room');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should fetch product by id', () => {
    const mockProduct: Product = {
      id: 1,
      name: 'Modern Sofa',
      description: 'A comfortable modern sofa',
      price: 999.99,
      category: 'Living Room',
      brand: 'IKEA',
      image: '/images/sofa.jpg', // Correct property name
      urlSlug: 'modern-sofa',
      stock: 5
    };

    authServiceSpy.getToken.and.returnValue('mock-token');

    service.getProductById(1).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('http://localhost:5186/api/products/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should add a product', () => {
    const newProduct = {
      name: 'New Chair',
      description: 'A new chair',
      price: 199.99,
      category: 'Office',
      brand: 'IKEA'
    };

    const mockResponse = { id: 3, ...newProduct };

    authServiceSpy.getToken.and.returnValue('mock-token');

    service.addProduct(newProduct).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5186/api/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(mockResponse);
  });
});
