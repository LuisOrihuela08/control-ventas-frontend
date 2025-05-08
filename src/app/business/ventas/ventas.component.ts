import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Venta } from '../../shared/models/Venta';
import { VentaService } from '../../shared/services/venta.service';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../shared/services/modal.service';
import { VentasReporteMetodoPagoComponent } from './ventas-reporte-metodo-pago/ventas-reporte-metodo-pago.component';
import { VentasAddModalComponent } from './ventas-add-modal/ventas-add-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, VentasReporteMetodoPagoComponent, VentasAddModalComponent],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent implements OnInit{

  ventas: Venta[] = [];

  //Esto es para la busqueda de ventas
  nombreProductoBuscado: string = ''; // Variable para almacenar el nombre buscado 
  metodoPagoBuscado: string = ''; // Variable para almacenar el metodo de pago buscado
  fechaInicio: string = ''; //Esto me va a permitir hacer la busqueda de inventario entre fechas
  fechaFin: string = ''; //Esto me va a permitir hacer la busqueda de inventario entre fechas
  fechaInicioPDF: string = ''; // Variable para almacenar la fecha de inicio del PDF
  fechaFinPDF: string = ''; // Variable para almacenar la fecha de fin del PDF

  //Esto es para los modales
  isModalReporteVentasMetodoPago: boolean = false;
  isModalAgregarVenta: boolean = false;
  //Esto es para la paginacion:
  currentPage: number = 0;//Numero de pagina
  pageSize: number = 14; // Número de elementos por página
  totalPages: number = 1; // Se actualizará según la respuesta del backend

  constructor(private ventaService: VentaService,
              private modalService: ModalService
             ){}

  ngOnInit(): void {
    this.listarVentasPaginadas();
    this.modalService.$modalReporteVentasMetodoPago.subscribe((valor) => {this.isModalReporteVentasMetodoPago = valor})
    this.modalService.$modalAgregarVenta.subscribe((valor) => {this.isModalAgregarVenta = valor})
  }

  //Esto es para abrir el modal de reporte de ventas por metodo  de pago
  mostrarModalReporteVentasMetodoPago(){
    this.modalService.$modalReporteVentasMetodoPago.emit(true);
    console.log('Modal de reporte de ventas por metodo de pago abierto');
  }

  //Método para abrir el modal de agregar venta
  mostrarModalAgregarVenta(){
    this.modalService.$modalAgregarVenta.emit(true);
    console.log('Modal de agregar venta abierto', this.isModalAgregarVenta);
  }

  //Método para listar las ventas paginadas
  listarVentasPaginadas(): void {

    this.ventaService.listVentasPaginadas(this.currentPage, this.pageSize).subscribe(
      (data: any) => {
        this.ventas = data.content; // Asignar el contenido de la respuesta a la variable ventas
        this.totalPages = data.totalPages; // Actualizar el total de páginas
        console.log('Total de páginas:', this.totalPages);
        console.log('Página actual:', this.currentPage);
        console.log('Productos listados:', this.ventas);
      },
      (error) => {
        console.error('Error al listar las ventas: ', error);
      }
    )
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.listarVentasPaginadas();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.listarVentasPaginadas();
    }
  }

  //Método para buscar venta por nombre del Producto
  buscarVentaPorNombreProducto(): void {

    if(!this.nombreProductoBuscado.trim()){
      this.listarVentasPaginadas();
      return;
    }

    //En caso si se proporciona un nombre de producto
    this.ventaService.findVentaByNombreProducto(this.nombreProductoBuscado, this.currentPage, this.pageSize).subscribe(
      (data: any) => {
        this.ventas = data.content;
        this.totalPages = data.totalPages;
        console.log('Ventas encontradas: ', this.ventas);
      },
      (error) => {
        console.error('Error al buscar ventas con el nombre del producto: ', error);
        this.ventas = []; // Limpiar la lista de ventas en caso de error
        this.totalPages = 0; // Reiniciar el total de páginas
      }
    )
  }

  //Método para buscar ventas por intervalos de fechas
  buscarVentasPorFechas(): void {

    if (!this.fechaInicio || !this.fechaFin) {
      this.listarVentasPaginadas();
      return;
    }

    this.ventaService.findVentaByFechasBetween(this.fechaInicio, this.fechaFin, this.currentPage, this.pageSize).subscribe(
      (data: any) => {
        this.ventas = data.content;
        this.totalPages = data.totalPages;
        console.log('Ventas encontradas por fechas: ', this.ventas);
      },
      (error) => {
        console.error('Error al buscar ventas por fechas: ', error);
        this.ventas = []; // Limpiar la lista de ventas en caso de error
        this.totalPages = 0; // Reiniciar el total de páginas
      }
    )
  }

  //Método para filtrar ventas por metodo de pago
  buscarVentasPorMetodoPago(): void {
    
    if (!this.metodoPagoBuscado.trim()) {
      this.listarVentasPaginadas();
      return;
    }

    this.ventaService.findVentasByMetodoPago(this.metodoPagoBuscado, this.currentPage, this.pageSize).subscribe(
      (data: any) => {
        this.ventas = data.content;
        this.totalPages = data.totalPages;
        console.log('Ventas encontradas por metodo de pago: ', this.ventas);
      },
      (error) => {
        console.error('Error al buscar ventas por metodo de pago: ', error);
        this.ventas = []; // Limpiar la lista de ventas en caso de error
        this.totalPages = 0; // Reiniciar el total de páginas
      }
    )
  }

  //Método para limpiar los filtros de búsqueda
  limpiarFiltros(): void{
    this.fechaInicio = ''; // Reiniciar el campo de fecha de inicio
    this.fechaFin = ''; // Reiniciar el campo de fecha de fin
    this.nombreProductoBuscado = ''; // Reiniciar el campo de nombre del producto
    this.metodoPagoBuscado = ''; // Reiniciar el campo de metodo de pago

    //Reiniciamos la paginacion
    this.currentPage = 0; // Reiniciar la página actual a la primera  
    this.pageSize = 14; // Reiniciar el tamaño de página a 14 elementos

    this.listarVentasPaginadas(); // Volver a listar las ventas paginadas
  }

  //Método para generar el PDF de una venta
  descargarVentaPDF(id: string): void{

    this.ventaService.generateVentaPDF(id).subscribe({
      next: (pdfBlob) => {
        const fileURL = window.URL.createObjectURL(pdfBlob);
        window.open(fileURL, '_blank');// Abrir el PDF en una nueva pestaña
        console.log('PDF de la venta generado y descargado con éxito.');
      },
      error: (error) => {
        console.error('Error al descargar el PDF de la venta: ', error);
        alert('Error al descargar el PDF de la venta. Por favor, inténtelo de nuevo más tarde.');
      }
      
    });
  }

  //Método para generar PDF de ventas entre fechas
  descargarVentasPDFByFechas(): void {

    if (!this.fechaInicioPDF || !this.fechaFinPDF) {
      //alert('Por favor, seleccione ambas fechas para generar el PDF.');
      Swal.fire({
        icon: 'warning',
        title: 'Fechas no seleccionadas',
        text: 'Por favor, seleccione ambas fechas para generar el PDF.',
        confirmButtonText: 'Aceptar'
      })
      return;
    }

    this.ventaService.generateVentasPDFByFechas(this.fechaInicioPDF, this.fechaFinPDF).subscribe({
      next: (pdfBlob) => {
        const fileURL = window.URL.createObjectURL(pdfBlob);
        window.open(fileURL, '_blank');// Abrir el PDF en una nueva pestaña
        console.log('Fechas ingresadas: ', this.fechaInicioPDF, this.fechaFinPDF);
        console.log('PDF de ventas entre fechas generado y descargado con éxito.');
      },
      error: (error) => {
        console.error('Error al descargar el PDF de ventas entre fechas: ', error);
        alert('Error al descargar el PDF de ventas entre fechas. Por favor, inténtelo de nuevo más tarde.');
      }
    });
  }

}
