import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusProductDetailsImageComponent } from './focus-product-details-image.component';

describe('FocusProductDetailsImageComponent', () => {
  let component: FocusProductDetailsImageComponent;
  let fixture: ComponentFixture<FocusProductDetailsImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FocusProductDetailsImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FocusProductDetailsImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
