import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextilComponent } from './textil.component';

describe('TextilComponent', () => {
  let component: TextilComponent;
  let fixture: ComponentFixture<TextilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
