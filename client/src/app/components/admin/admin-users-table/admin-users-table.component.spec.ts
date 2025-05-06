import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminuserstableComponent } from './admin-users-table.component';

describe('AdminuserstableComponent', () => {
  let component: AdminuserstableComponent;
  let fixture: ComponentFixture<AdminuserstableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminuserstableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminuserstableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
