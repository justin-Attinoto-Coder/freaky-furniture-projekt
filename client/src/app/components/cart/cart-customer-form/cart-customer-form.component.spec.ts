import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartCustomerFormComponent } from './cart-customer-form.component';

describe('CartCustomerFormComponent', () => {
  let component: CartCustomerFormComponent;
  let fixture: ComponentFixture<CartCustomerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartCustomerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartCustomerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
