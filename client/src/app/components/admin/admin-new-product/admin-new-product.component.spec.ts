import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminnewproductComponent } from './admin-new-product.component';

describe('AdminnewproductComponent', () => {
  let component: AdminnewproductComponent;
  let fixture: ComponentFixture<AdminnewproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminnewproductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminnewproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
