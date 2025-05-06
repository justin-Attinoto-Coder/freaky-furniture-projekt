import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentformComponent } from './payment-form.component';

describe('PaymentformComponent', () => {
  let component: PaymentformComponent;
  let fixture: ComponentFixture<PaymentformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
