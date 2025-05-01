import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosAddModalComponent } from './productos-add-modal.component';

describe('ProductosAddModalComponent', () => {
  let component: ProductosAddModalComponent;
  let fixture: ComponentFixture<ProductosAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosAddModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
