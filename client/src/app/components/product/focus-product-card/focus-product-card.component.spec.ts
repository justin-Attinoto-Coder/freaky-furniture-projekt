import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusProductCardComponent } from './focus-product-card.component';

describe('FocusProductCardComponent', () => {
  let component: FocusProductCardComponent;
  let fixture: ComponentFixture<FocusProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FocusProductCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FocusProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
