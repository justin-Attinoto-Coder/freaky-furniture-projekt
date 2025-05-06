import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutreviewprogressbarComponent } from './checkout-review-progress-bar.component';

describe('CheckoutreviewprogressbarComponent', () => {
  let component: CheckoutreviewprogressbarComponent;
  let fixture: ComponentFixture<CheckoutreviewprogressbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutreviewprogressbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutreviewprogressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
