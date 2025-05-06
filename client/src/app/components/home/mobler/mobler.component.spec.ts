import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoblerComponent } from './mobler.component';

describe('MoblerComponent', () => {
  let component: MoblerComponent;
  let fixture: ComponentFixture<MoblerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoblerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoblerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
