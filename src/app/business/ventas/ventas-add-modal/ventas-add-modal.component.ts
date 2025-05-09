import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/services/modal.service';
import { Producto } from '../../../shared/models/Producto';
import { VentaService } from '../../../shared/services/venta.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Venta } from '../../../shared/models/Venta';

@Component({
  selector: 'app-ventas-add-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ventas-add-modal.component.html',
  styleUrl: './ventas-add-modal.component.css'
})
export class VentasAddModalComponent implements OnInit {

  ventas: Venta = new Venta(); // Objeto para almacenar la venta
  productos: Producto[] = [];
  productosVenta: Producto[] = []; // Array para almacenar los productos seleccionados para la venta
  ventaForm!: FormGroup;

  metodosPago: string[] = []; // Esto es para almacenar los metodos de pago

  nombreProductoBuscado: string = '';

  constructor(private modalService: ModalService,
    private ventaService: VentaService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.ventaForm = this.fb.group({
      metodoPago: ['', Validators.required],
      dinero_cliente: ['', Validators.required],
      productos_vendidos: [null], // Inicializa el campo de productos vendidos como null
      monto_total: [0], // Inicializa el campo de monto total como 0
      vuelto: [0] // Inicializa el campo de vuelto como 0

    });

    //Esto es para listar los metodos de pago al inciar el componente
    this.listarMetodosPago();

    //Esto es para escuchar los cambios en el formulario y mostrar los valores actuales
    console.log(this.ventaForm.value);
    this.ventaForm.valueChanges.subscribe((value) => {
      console.log('Valores actuales del formulario: ', value);
    })
  }

  //Método para cerrar el Modal de Agregar Producto
  cerrarModalAgregarProducto() {
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
  limpiarFiltros(): void {
    this.nombreProductoBuscado = ''; // Reiniciar el campo de nombre del producto
    this.productos = [];             // Vaciar la tabla 
  }

  //Método para agregar el producto a la venta
  agregarProductoAVenta(producto: any) {
    const productoVenta = {
      id: producto.id,
      codigo: producto.codigo,
      nombreProducto: producto.nombreProducto,
      marca: producto.marca,
      precio_unitario: producto.precio_unitario,
      cantidad: 1, // Puedes establecer la cantidad inicial aquí
      descripcion: producto.descripcion
    };
    this.productosVenta.push(productoVenta);
  }

  //Método para eliminar un producto seleccionado de una venta
  eliminarProductoDeVenta(index: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este producto será eliminado de la venta',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productosVenta.splice(index, 1);
        Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
      }
    });
  }

  //Método para calcular el total de la venta
  calcularTotal(): number {
    return this.productosVenta.reduce((sum, p) => sum + (p.precio_unitario * p.cantidad), 0);
  }

  //Método para calcular el vuelto
  calcularVuelto(): number {
    const dineroCliente = this.ventaForm?.get('dinero_cliente')?.value || 0;
    const total = this.calcularTotal();
    const vuelto = dineroCliente - total;
    return vuelto >= 0 ? vuelto : 0;
  }



  //Método para registrar una venta
  registrarVenta(): void {

    if (this.productosVenta.length === 0) {
      Swal.fire('Error', 'No hay productos seleccionados para la venta.', 'error');
      return;
    }

    if (this.ventaForm.invalid) {
      Swal.fire('Error', 'Completa los datos de método de pago y dinero del cliente.', 'error');
      return;
    }

    // Actualizar el formulario con los productos vendidos
    this.ventaForm.patchValue({
      productos_vendidos: this.productosVenta
    });

    // Puedes verificar los valores antes de enviarlos
    console.log('Valores actuales del formulario:', this.ventaForm.value);

    // Asignar al modelo y enviar
    this.ventas = this.ventaForm.value;

    // Asignar valores del formulario
    this.ventas = this.ventaForm.value;

    // Agregar campos calculados
    this.ventas.monto_total = this.calcularTotal();
    this.ventas.vuelto = this.calcularVuelto();

    console.log('Venta a registrar:', this.ventas);

    this.ventaService.createVenta(this.ventas).subscribe(
      (response) => {
        Swal.fire('Éxito', 'La venta ha sido registrada exitosamente.', 'success');
        console.log('Venta registrada:', response);
        console.log('Productos vendidos:', this.productosVenta);
        // Generar el PDF de la venta registrada
        this.ventaService.generateVentaPDF(response.id).subscribe({
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
        
        this.productosVenta = []; // Limpiar la lista de productos después de registrar la venta
        this.ventaForm.reset(); // Limpia el formulario
        this.limpiarFiltros(); // Limpiar los filtros de búsqueda
        this.ventaService.notificarVentasUpdate(); // Notificar a otros componentes sobre la actualización de ventas
      },
      (error) => {
        console.error('Error al registrar la venta:', error);
        Swal.fire('Error', 'No se pudo registrar la venta. Inténtalo de nuevo.', 'error');
      }
    );
  }

  //Método para listar los metodos de pago
  listarMetodosPago(): void {
    this.ventaService.listMetodosPago().subscribe(
      (data: string[]) => {
        this.metodosPago = data; // Asignar la respuesta a la variable metodosPago
        console.log('Métodos de pago listados: ', this.metodosPago);
      },
      (error) => {
        console.error('Error al listar los métodos de pago: ', error);
      }
    )

  }
}
