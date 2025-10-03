import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { GoToCartComponent } from './go-to-cart.component';
import { CartService } from '../../../services/cart.service';

describe('GoToCartComponent', () => {
  let component: GoToCartComponent;
  let fixture: ComponentFixture<GoToCartComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockCartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    // Create spies for Router and CartService
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockCartService = jasmine.createSpyObj('CartService', [], {
      cartItems$: of([
        { id: 1, productId: 1, name: 'Test Product', price: 100, quantity: 2, imageURL: '', brand: '', urlSlug: '' }
      ])
    });

    await TestBed.configureTestingModule({
      declarations: [GoToCartComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: CartService, useValue: mockCartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GoToCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.variant).toBe('primary');
    expect(component.size).toBe('md');
    expect(component.showIcon).toBe(true);
    expect(component.buttonText).toBe('Gå till kundvagn');
    expect(component.showCartCount).toBe(true);
  });

  it('should navigate to cart when goToCart is called', () => {
    component.goToCart();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/cart']);
  });

  it('should display cart count when items exist', () => {
    component.cartItemCount$.subscribe(count => {
      expect(count).toBe(2); // 1 item with quantity 2
    });
  });

  it('should generate correct CSS classes for primary variant', () => {
    component.variant = 'primary';
    component.size = 'md';
    const classes = component.getButtonClasses();
    expect(classes).toContain('bg-green-600');
    expect(classes).toContain('hover:bg-green-700');
    expect(classes).toContain('px-4 py-2.5');
  });

  it('should generate correct CSS classes for outline variant', () => {
    component.variant = 'outline';
    component.size = 'sm';
    const classes = component.getButtonClasses();
    expect(classes).toContain('border-2 border-green-600');
    expect(classes).toContain('text-green-600');
    expect(classes).toContain('px-3 py-2');
  });

  it('should generate correct CSS classes for large size', () => {
    component.size = 'lg';
    const classes = component.getButtonClasses();
    expect(classes).toContain('px-6 py-3 text-lg');
  });

  it('should hide cart count when showCartCount is false', () => {
    component.showCartCount = false;
    fixture.detectChanges();

    const cartBadge = fixture.nativeElement.querySelector('.cart-badge');
    expect(cartBadge).toBeFalsy();
  });

  it('should hide icon when showIcon is false', () => {
    component.showIcon = false;
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('.fas.fa-shopping-cart');
    expect(icon).toBeFalsy();
  });

  it('should display custom button text', () => {
    component.buttonText = 'Custom Cart Text';
    fixture.detectChanges();

    const buttonText = fixture.nativeElement.querySelector('.button-text');
    expect(buttonText.textContent.trim()).toBe('Custom Cart Text');
  });

  it('should render button with correct attributes', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.type).toBe('button');
    expect(button.title).toBe(component.buttonText);
  });
});
