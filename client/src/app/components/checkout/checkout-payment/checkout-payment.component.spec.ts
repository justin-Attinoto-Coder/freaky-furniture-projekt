import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutpaymentComponent } from './checkout-payment.component';

describe('CheckoutpaymentComponent', () => {
  let component: CheckoutpaymentComponent;
  let fixture: ComponentFixture<CheckoutpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutpaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
