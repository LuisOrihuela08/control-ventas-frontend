import { Component } from '@angular/core';
import { ModalService } from '../../../shared/services/modal.service';
import { Producto } from '../../../shared/models/Producto';
import { VentaService } from '../../../shared/services/venta.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ventas-add-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ventas-add-modal.component.html',
  styleUrl: './ventas-add-modal.component.css'
})
export class VentasAddModalComponent {

  productos: Producto[] = [];

  nombreProductoBuscado: string = '';

  constructor(private modalService: ModalService,
              private ventaService: VentaService
             ){}

  //Método para cerrar el Modal de Agregar Producto
  cerrarModalAgregarProducto(){
    this.modalService.$modalAgregarVenta.emit(false);
  }

  //Método para buscar productos por el nombre
  buscarProductoPorNombre(): void {
    if (!this.nombreProductoBuscado.trim()) {
      alert('Por favor, ingrese un nombre de producto para buscar.');
      console.log('Nombre de producto vacío. No se realizará la búsqueda.');
      return;
    }

    //En caso si el nombre no es vacío, y se llama al método
    this.ventaService.findProductoByNombreForVenta(this.nombreProductoBuscado).subscribe(
      (data: any) => {
        this.productos = data; // Asignar los productos a la variable
        console.log('Productos encontrados:', this.productos);
      },
      (error) => {
        console.error('Error al buscar el producto:', error);
      }
    )
  }
  //Método para limpiar los filtros de búsqueda
  limpiarFiltros(): void{
    this.nombreProductoBuscado = ''; // Reiniciar el campo de nombre del producto
    this.productos = [];             // Vaciar la tabla 
  }
}
