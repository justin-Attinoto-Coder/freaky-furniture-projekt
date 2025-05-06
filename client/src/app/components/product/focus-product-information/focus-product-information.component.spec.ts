import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusProductInformationComponent } from './focus-product-information.component';

describe('FocusProductInformationComponent', () => {
  let component: FocusProductInformationComponent;
  let fixture: ComponentFixture<FocusProductInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FocusProductInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FocusProductInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
