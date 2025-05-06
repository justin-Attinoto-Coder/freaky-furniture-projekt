import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForvaringComponent } from './forvaring.component';

describe('ForvaringComponent', () => {
  let component: ForvaringComponent;
  let fixture: ComponentFixture<ForvaringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForvaringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForvaringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
