import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasReporteMetodoPagoComponent } from './ventas-reporte-metodo-pago.component';

describe('VentasReporteMetodoPagoComponent', () => {
  let component: VentasReporteMetodoPagoComponent;
  let fixture: ComponentFixture<VentasReporteMetodoPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasReporteMetodoPagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasReporteMetodoPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
