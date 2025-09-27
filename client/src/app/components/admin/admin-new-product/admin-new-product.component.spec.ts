import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { AdminNewProductComponent } from './admin-new-product.component';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';

describe('AdminNewProductComponent', () => {
  let component: AdminNewProductComponent;
  let fixture: ComponentFixture<AdminNewProductComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Create spy objects
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockProductService = jasmine.createSpyObj('ProductService', ['addProduct']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getToken']);

    await TestBed.configureTestingModule({
      imports: [
        AdminNewProductComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ProductService, useValue: mockProductService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default form data', () => {
    expect(component.formData.namn).toBe('');
    expect(component.formData.kategori).toBe('mobler');
    expect(component.errors).toEqual({});
  });

  it('should generate correct URL slug', () => {
    // Access private method for testing
    const generateUrlSlug = (component as any).generateUrlSlug;
    expect(generateUrlSlug('Modern Soffa')).toBe('modern-soffa');
    expect(generateUrlSlug('Kök Stol')).toBe('kok-stol');
    expect(generateUrlSlug('Test Product åäö')).toBe('test-product-aao');
  });

  it('should map categories to correct IDs', () => {
    // Access private method for testing
    const getCategoryId = (component as any).getCategoryId;
    expect(getCategoryId('sofas')).toBe(1);
    expect(getCategoryId('chairs')).toBe(2);
    expect(getCategoryId('unknown')).toBe(1); // Default fallback
  });

  it('should validate required fields', () => {
    // Test empty form
    expect(component.validateForm()).toBeFalse();
    expect(component.errors.namn).toBeDefined();
    expect(component.errors.bild).toBeDefined();

    // Test valid form
    component.formData.namn = 'Test Product';
    component.formData.bild = '/images/test.jpg';
    component.formData.sku = 'ABC123';
    expect(component.validateForm()).toBeTrue();
    expect(Object.keys(component.errors)).toHaveSize(0);
  });

  it('should navigate to admin table on cancel', () => {
    component.cancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/table']);
  });
});
