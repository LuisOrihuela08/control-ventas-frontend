import { Component, OnInit } from '@angular/core';
import { Producto } from '../../shared/models/Producto';
import { ProductoService } from '../../shared/services/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit{

  productos: Producto[] = [];

  nombreProductoBuscado: string = ''; // Variable para almacenar el nombre buscado
  marcaBuscada: string = ''; // Variable para almacenar la marca buscada
  //Esto es para la paginacion:
  currentPage: number = 0;//Numero de pagina
  pageSize: number = 15; // Número de elementos por página
  totalPages: number = 1; // Se actualizará según la respuesta del backend

  constructor(private productoService: ProductoService){}


  ngOnInit(): void {
    this.listarProductosPaginados();
  }

  /*Listar Productos*/ 
  listarProductosPaginados(): void{

    this.productoService.listProductosPaginados(this.currentPage, this.pageSize).subscribe(
      (data: any) => {
        this.productos = data.content; // Asignar los productos a la variable
        this.totalPages = data.totalPages; // Actualizar el total de páginas
        console.log('Total de páginas:', this.totalPages);
        console.log('Página actual:', this.currentPage);
        console.log('Productos listados:', this.productos);     
      },
      (error) => {
        console.error('Error al listar los productos:', error);
      }
    );
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.listarProductosPaginados();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.listarProductosPaginados();
    }
  }

  //Método para buscar producto por nombre
  buscarProductoPorNombre(): void{
   
    if(!this.nombreProductoBuscado.trim()){
      this.listarProductosPaginados();
      return;
    }

    //En caso si el nombre no es vacío, y se llama al método
    this.productoService.getProductoByNombre(this.nombreProductoBuscado, this.currentPage, this.pageSize).subscribe(
      (data: any) => {
        this.productos = data.content; // Asignar los productos a la variable
        this.totalPages = data.totalPages; // Actualizar el total de páginas
        console.log('Productos encontrados:', this.productos);
      },
      (error) => {
        console.error('Error al buscar el producto:', error);
        // Si hubo error (ej. 404), asumimos que no hay productos
        this.productos = [];
        this.totalPages = 0;
      }
    )
  }

  //Método para buscar por marca
  buscarProductoPorMarca(): void{

    if(!this.marcaBuscada.trim()){
      this.listarProductosPaginados();
      return;
    }

    //En caso si ingresa una marca
    this.productoService.getProductoByMarca(this.marcaBuscada, this.currentPage, this.pageSize).subscribe(
      (data:any) => {
        this.productos = data.content;
        this.totalPages = data.totalPages;
        console.log('Productos encontrados por marca:', this.productos);
      },
      (error) => {
        console.error('Error al buscar el producto por marca:', error);
        // Si hubo error (ej. 404), asumimos que no hay productos
        this.productos = [];
        this.totalPages = 0;
      }
    )
  }

  //Método para descargar el inventario de productos en excel
  descargarProductosExcel(): void{
    
    this.productoService.downloadExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'productos-inventario.xlsx'; // Nombre del archivo a descargar
        a.click();
        window.URL.revokeObjectURL(url); // Liberar el objeto URL
      },
      error: (error) => {
        console.error('Error al descargar el archivo Excel: ', error);
      }
    })
  }

  //Método para descargar el inventario de productos en pdf
  descargarProductosPDF(): void {

    this.productoService.downloadPDF().subscribe({
      next: (pdfBlob) => {
        const fileURL = window.URL.createObjectURL(pdfBlob);
        window.open(fileURL, '_blank'); // Abrir el PDF en una nueva pestaña
      },
      error: (error) => {
        console.error('Error al descargar el PDF: ', error);
      }
    })
  }
}
