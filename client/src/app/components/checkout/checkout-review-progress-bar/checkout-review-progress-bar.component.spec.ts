import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutReviewProgressBarComponent } from './checkout-review-progress-bar.component';

describe('CheckoutReviewProgressBarComponent', () => {
  let component: CheckoutReviewProgressBarComponent;
  let fixture: ComponentFixture<CheckoutReviewProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutReviewProgressBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutReviewProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
