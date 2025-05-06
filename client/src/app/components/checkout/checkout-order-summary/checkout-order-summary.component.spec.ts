import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutordersummaryComponent } from './checkout-order-summary.component';

describe('CheckoutordersummaryComponent', () => {
  let component: CheckoutordersummaryComponent;
  let fixture: ComponentFixture<CheckoutordersummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutordersummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutordersummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
