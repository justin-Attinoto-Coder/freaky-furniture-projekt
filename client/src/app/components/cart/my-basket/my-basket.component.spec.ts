import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBasketComponent } from './my-basket.component';

describe('MyBasketComponent', () => {
  let component: MyBasketComponent;
  let fixture: ComponentFixture<MyBasketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBasketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyBasketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
