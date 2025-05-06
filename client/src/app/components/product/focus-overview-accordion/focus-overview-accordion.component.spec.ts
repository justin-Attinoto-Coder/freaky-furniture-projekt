import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusOverviewAccordionComponent } from './focus-overview-accordion.component';

describe('FocusOverviewAccordionComponent', () => {
  let component: FocusOverviewAccordionComponent;
  let fixture: ComponentFixture<FocusOverviewAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FocusOverviewAccordionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FocusOverviewAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
