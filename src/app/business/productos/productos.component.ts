import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Producto } from '../../shared/models/Producto';
import { ProductoService } from '../../shared/services/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ModalService } from '../../shared/services/modal.service';
import { ProductosAddModalComponent } from './productos-add-modal/productos-add-modal.component';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductosAddModalComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit, OnDestroy {

  productos: Producto[] = [];

  //Esto es para la busqueda de productos y archivo excel, PDF
  nombreProductoBuscado: string = ''; // Variable para almacenar el nombre buscado
  marcaBuscada: string = ''; // Variable para almacenar la marca buscada
  selectFile: File | null = null; // Variable para almacenar el archivo seleccionado
  mensajeImportExcel: string = ''; // Mensaje para mostrar el resultado de la importación
  progresoImportExcel: number = 0; // Progreso de la carga del archivo
  //Esto es para los modales
  isModalAgregarProductoVisible: boolean = false; // Variable para controlar la visibilidad del modal de agregar producto
  //Esto es para la paginacion:
  currentPage: number = 0;//Numero de pagina
  pageSize: number = 14; // Número de elementos por página
  totalPages: number = 1; // Se actualizará según la respuesta del backend
  //Esto es para actualizar el inventario de productos
  private productosSubscribe: Subscription = undefined!; // Esto es para actualizar el inventario de productos

  //Esto es para el input de archivo
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>; // Referencia al input de archivo

  constructor(private productoService: ProductoService,
              private modalService: ModalService
              ) { }

  ngOnDestroy(): void {
    //Aca nos aseguramos de cerrar la subscripcion al servicio
    if(this.productosSubscribe){
      this.productosSubscribe.unsubscribe();
    }
  }


  ngOnInit(): void {
    this.listarProductosPaginados();
    this.modalService.$modalAgregarProducto.subscribe((valor) => {this.isModalAgregarProductoVisible = valor})
    this.productosSubscribe = this.productoService.productosUpdate$.subscribe(
      () => {
        this.listarProductosPaginados(); // Actualizar la lista de productos al recibir la notificación
        console.log('Lista de productos actualizada desde el servicio');
      }
    )

  }

  //Esto es para abrir el modal de agregar producto
  mostrarModalAgregarProducto() {
    this.modalService.$modalAgregarProducto.emit(true);
    console.log('Modal de agregar producto abierto', this.isModalAgregarProductoVisible);
  }

  /*Listar Productos*/
  listarProductosPaginados(): void {

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
  buscarProductoPorNombre(): void {

    if (!this.nombreProductoBuscado.trim()) {
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
  buscarProductoPorMarca(): void {

    if (!this.marcaBuscada.trim()) {
      this.listarProductosPaginados();
      return;
    }

    //En caso si ingresa una marca
    this.productoService.getProductoByMarca(this.marcaBuscada, this.currentPage, this.pageSize).subscribe(
      (data: any) => {
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
  descargarProductosExcel(): void {

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
        alert('Error al descargar el archivo Excel' );
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
        alert('Error al descargar el PDF' );
      }
    })
  }

  //Aca esta todo para importar el inventario de productos desde un archivo excel
  // Método para disparar el input
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectFile = input.files[0];
      this.importarExcel();
    }
  }

  importarExcel(): void {

    if (!this.selectFile) {
      this.mensajeImportExcel = 'Por favor, seleccione un archivo para importar.';
      console.error(this.mensajeImportExcel);
      alert(this.mensajeImportExcel);
      return;
    }

    this.productoService.importExcel(this.selectFile).subscribe({
      next: (event: HttpEvent<any>) => {

        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total) {
              this.progresoImportExcel = Math.round((event.loaded / event.total) * 100);
            }
            break;
          case HttpEventType.Response:
            this.mensajeImportExcel = 'Archivo importado exitosamente.';
            alert(this.mensajeImportExcel);
            console.log(this.mensajeImportExcel);
            this.progresoImportExcel = 0;
            this.selectFile = null;
            this.listarProductosPaginados();
            break;
        }
      },
      error: (error) => {
        this.mensajeImportExcel = 'Error al importar el archivo: ' + error.message;
        console.error(error);
        alert(this.mensajeImportExcel);
        this.progresoImportExcel = 0;
      }
    });
  }

  //Método para eliminar producto
  eliminarProducto(id: string): void {
    
    Swal.fire({
      title: '¿Estás seguro de eliminar este producto?',
      text: 'No habra manera de revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, quiero eliminarlo!"
    }).then((result) => {
      if(result.isConfirmed){
        this.productoService.deleteProducto(id).subscribe(
          (response) => {
            Swal.fire({
              title: 'Producto eliminado',
              text: 'El producto ha sido eliminado exitosamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });
            console.log(`Inventario con ID ${id} eliminado correctamente`);
            console.log('Respuesta del servidor: ', response);
            // Notificar al servicio que se actualizó el inventario de productos
            this.productos = this.productos.filter(producto => producto.id !== id); // Actualizar la lista de productos en el componente
            this.productoService.notificarProductosUpdate();
          },
          (error) => {
            console.error('Error al eliminar el producto: ', error);
            Swal.fire({
              title: 'Error al eliminar el producto',
              text: 'No se pudo eliminar el producto.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          }
        )
      }
    })
  }
}
