import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService, CartItem, CustomerData } from './cart.service';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService]
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load cart items on initialization', () => {
    const mockCartItems: CartItem[] = [
      {
        id: 1,
        productId: 1,
        name: 'Modern Sofa',
        price: 999.99,
        quantity: 1,
        imageURL: '/images/sofa.jpg',
        brand: 'IKEA',
        urlSlug: 'modern-sofa'
      }
    ];

    // The constructor calls loadCartItems, so we expect this request
    const req = httpMock.expectOne('http://localhost:5186/api/cart');
    expect(req.request.method).toBe('GET');
    req.flush(mockCartItems);
  });

  it('should add cart item', () => {
    const newItem: CartItem = {
      productId: 1,
      name: 'Office Chair',
      price: 299.99,
      quantity: 1,
      imageURL: '/images/chair.jpg',
      brand: 'IKEA',
      urlSlug: 'office-chair'
    };

    const mockResponse = { id: 2 };

    service.addCartItem(newItem).subscribe(response => {
      expect(response.id).toBe(2);
    });

    // Expect the add request
    const addReq = httpMock.expectOne('http://localhost:5186/api/cart');
    expect(addReq.request.method).toBe('POST');
    addReq.flush(mockResponse);

    // Expect the reload request after adding
    const reloadReq = httpMock.expectOne('http://localhost:5186/api/cart');
    expect(reloadReq.request.method).toBe('GET');
    reloadReq.flush([newItem]);
  });

  it('should add customer', () => {
    const customerData: CustomerData = {
      fullName: 'John Doe',
      phoneNumber: '123-456-7890',
      province: 'Ontario',
      city: 'Toronto',
      streetAddress: '123 Main St',
      postalCode: 'K1A 0A9'
    };

    const mockResponse = { id: 1, message: 'Customer added successfully' };

    service.addCustomer(customerData).subscribe(response => {
      expect(response.message).toBe('Customer added successfully');
    });

    const req = httpMock.expectOne('http://localhost:5186/api/customers');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(customerData);
    req.flush(mockResponse);
  });
});
