import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutheaderComponent } from './checkout-header.component';

describe('CheckoutheaderComponent', () => {
  let component: CheckoutheaderComponent;
  let fixture: ComponentFixture<CheckoutheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutheaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
