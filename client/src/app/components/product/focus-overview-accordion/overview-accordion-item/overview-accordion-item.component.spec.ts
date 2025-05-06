import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewAccordionItemComponent } from './overview-accordion-item.component';

describe('OverviewAccordionItemComponent', () => {
  let component: OverviewAccordionItemComponent;
  let fixture: ComponentFixture<OverviewAccordionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewAccordionItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverviewAccordionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
