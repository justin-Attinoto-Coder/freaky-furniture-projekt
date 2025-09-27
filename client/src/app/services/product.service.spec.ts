import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService, CreateProductRequest, ApiResponse } from './product.service';
import { Product } from '../models/product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products from API', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Test Chair',
        category: 'mobler',
        price: 1000,
        description: 'Test description',
        image: 'test.jpg',
        urlSlug: 'test-chair',
        brand: 'Test Brand',
        sku: 'TST001',
        categoryId: 1,
        publishing_date: new Date().toISOString()
      }
    ];

    service.getProducts().subscribe((products: Product[]) => {
      expect(products).toEqual(mockProducts);
      expect(products.length).toBe(1);
    });

    const req = httpMock.expectOne('https://localhost:7001/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should get product by id', () => {
    const mockProduct: Product = {
      id: 1,
      name: 'Test Chair',
      category: 'mobler',
      price: 1000,
      description: 'Test description',
      image: 'test.jpg',
      urlSlug: 'test-chair',
      brand: 'Test Brand',
      sku: 'TST001',
      categoryId: 1,
      publishing_date: new Date().toISOString()
    };

    service.getProductById(1).subscribe((product: Product | null) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('https://localhost:7001/api/products/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should add new product', () => {
    const newProduct: CreateProductRequest = {
      name: 'New Chair',
      description: 'New description',
      image: 'new.jpg',
      brand: 'New Brand',
      price: 1500,
      urlSlug: 'new-chair',
      sku: 'NEW001',
      categoryId: 1
    };

    const mockResponse: ApiResponse<Product> = {
      success: true,
      data: {
        id: 2,
        name: 'New Chair',
        category: 'mobler',
        price: 1500,
        description: 'New description',
        image: 'new.jpg',
        urlSlug: 'new-chair',
        brand: 'New Brand',
        sku: 'NEW001',
        categoryId: 1,
        publishing_date: new Date().toISOString()
      }
    };

    service.addProduct(newProduct).subscribe((response: ApiResponse<Product>) => {
      expect(response.success).toBe(true);
      expect(response.data.name).toBe('New Chair');
    });

    const req = httpMock.expectOne('https://localhost:7001/api/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(mockResponse);
  });

  it('should generate dynamic products when API fails', () => {
    service.getFurnitureItems().subscribe((products: Product[]) => {
      expect(products.length).toBeGreaterThan(0);
      expect(products.length).toBe(100); // 25 products × 4 categories

      const categories = [...new Set(products.map(p => p.category))];
      expect(categories).toContain('mobler');
      expect(categories).toContain('forvaring');
      expect(categories).toContain('detaljer');
      expect(categories).toContain('textil');

      products.forEach(product => {
        expect(product.id).toBeTruthy();
        expect(product.name).toBeTruthy();
        expect(product.category).toBeTruthy();
        expect(product.price).toBeGreaterThan(0);
        expect(product.image).toContain('freaky-furniture-ai-cs-');
        expect(product.urlSlug).toBeTruthy();
        expect(product.sku).toMatch(/^FREAKY-[A-Z]+-\d{3}$/);
      });
    });

    const req = httpMock.expectOne('https://localhost:7001/api/products');
    req.error(new ErrorEvent('Network error'));
  });
});
