import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaybeYouAlsoLikeComponent } from './maybe-you-also-like.component';

describe('MaybeYouAlsoLikeComponent', () => {
  let component: MaybeYouAlsoLikeComponent;
  let fixture: ComponentFixture<MaybeYouAlsoLikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaybeYouAlsoLikeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaybeYouAlsoLikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
