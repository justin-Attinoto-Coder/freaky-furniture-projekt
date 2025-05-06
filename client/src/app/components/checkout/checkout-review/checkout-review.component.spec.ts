import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutreviewComponent } from './checkout-review.component';

describe('CheckoutreviewComponent', () => {
  let component: CheckoutreviewComponent;
  let fixture: ComponentFixture<CheckoutreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
