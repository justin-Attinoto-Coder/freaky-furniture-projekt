import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewproductcardComponent } from './review-product-card.component';

describe('ReviewproductcardComponent', () => {
  let component: ReviewproductcardComponent;
  let fixture: ComponentFixture<ReviewproductcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewproductcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewproductcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
