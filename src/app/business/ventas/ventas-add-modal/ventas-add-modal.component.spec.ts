import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasAddModalComponent } from './ventas-add-modal.component';

describe('VentasAddModalComponent', () => {
  let component: VentasAddModalComponent;
  let fixture: ComponentFixture<VentasAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasAddModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
