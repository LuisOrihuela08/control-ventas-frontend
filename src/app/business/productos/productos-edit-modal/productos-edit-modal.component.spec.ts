import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosEditModalComponent } from './productos-edit-modal.component';

describe('ProductosEditModalComponent', () => {
  let component: ProductosEditModalComponent;
  let fixture: ComponentFixture<ProductosEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
