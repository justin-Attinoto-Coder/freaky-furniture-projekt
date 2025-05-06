import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonAccordionComponent } from './common-accordion.component';

describe('CommonAccordionComponent', () => {
  let component: CommonAccordionComponent;
  let fixture: ComponentFixture<CommonAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonAccordionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
