import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaljerComponent } from './detaljer.component';

describe('DetaljerComponent', () => {
  let component: DetaljerComponent;
  let fixture: ComponentFixture<DetaljerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetaljerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetaljerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
