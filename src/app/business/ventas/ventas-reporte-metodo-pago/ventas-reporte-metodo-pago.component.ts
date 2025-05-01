import { Component, OnInit } from '@angular/core';
import { ReporteVentasPorMetodoPagoDTO } from '../../../shared/models/ReporteVentasPorMetodoPagoDTO';
import { VentaService } from '../../../shared/services/venta.service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../shared/services/modal.service';

@Component({
  selector: 'app-ventas-reporte-metodo-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ventas-reporte-metodo-pago.component.html',
  styleUrl: './ventas-reporte-metodo-pago.component.css'
})
export class VentasReporteMetodoPagoComponent implements OnInit{

  reporte: ReporteVentasPorMetodoPagoDTO [] = [];

  constructor(private ventaService: VentaService,
              private modalService: ModalService
  ){}

  ngOnInit(): void {
    this.generarReporteVentasPorMetodoPago();
  }

  //Método para cerrar el modal
  cerrarModalReporteVentasMetodoPago(){
    this.modalService.$modalReporteVentasMetodoPago.emit(false);
  }

  //Método para generar el reporte de ventas por metodo de pago
  generarReporteVentasPorMetodoPago(): void {

    this.ventaService.createReportVentasByMetodoPago().subscribe({
      next: (data) => {
        this.reporte = data;
        console.log(this.reporte);
      },
      error: (error) => {
        console.error('Error al generar el reporte de ventas por metodo de pago', error);
      }
    });
  }

}
