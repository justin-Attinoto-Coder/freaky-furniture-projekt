import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonAccordionItemComponent } from './common-accordion-item.component';

describe('CommonAccordionItemComponent', () => {
  let component: CommonAccordionItemComponent;
  let fixture: ComponentFixture<CommonAccordionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonAccordionItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonAccordionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
