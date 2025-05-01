import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Venta } from '../../shared/models/Venta';
import { VentaService } from '../../shared/services/venta.service';
import { Producto } from '../../shared/models/Producto';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent implements OnInit{

  ventas: Venta[] = [];


  //Esto es para la paginacion:
  currentPage: number = 0;//Numero de pagina
  pageSize: number = 14; // Número de elementos por página
  totalPages: number = 1; // Se actualizará según la respuesta del backend

  constructor(private ventaService: VentaService){}

  ngOnInit(): void {
    this.listarVentasPaginadas();
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

}
