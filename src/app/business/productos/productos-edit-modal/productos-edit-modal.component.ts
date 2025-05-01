import { Component, Input, OnInit } from '@angular/core';
import { Producto } from '../../../shared/models/Producto';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../../shared/services/producto.service';
import { ModalService } from '../../../shared/services/modal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos-edit-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './productos-edit-modal.component.html',
  styleUrl: './productos-edit-modal.component.css'
})
export class ProductosEditModalComponent implements OnInit {

  @Input() producto!: Producto;//Recibe el producto a editar desde el componente padre
  productos: Producto = new Producto();//Inicializa el producto a editar y enviar los campos al backend
  productoForm!: FormGroup;//Inicializa el formulario para editar el producto

  constructor(private productoService: ProductoService,
              private fb: FormBuilder,
              private modalService: ModalService
              ){}

  ngOnInit(): void {
    //Inicializamos el formulario con los campos del producto a editar
    this.productoForm = this.fb.group({
      id: [this.producto.id],
      nombreProducto: [this.producto.nombreProducto],
      marca: [this.producto.marca],
      cantidad: [this.producto.cantidad],
      precio_unitario: [this.producto.precio_unitario]
    });
    //Aca verifico los valores del producto a editar
    console.log(this.productoForm.value);
    this.productoForm.valueChanges.subscribe((value) => {
      console.log('Valores actuales del formulario: ', value);
    });
  }

  //Método para editar el producto
  editarProducto(){

    if(this.productoForm.invalid){
      console.log('Formulario inválido');
      return;
    }

    const productoEditado: Producto = this.productoForm.value;

    this.productoService.editProducto(this.producto.id, productoEditado).subscribe({
      next: (response) => {
        console.log('Producto editado: ', response);
        this.productoService.notificarProductosUpdate();//Notificamos al servicio que se ha editado un producto
        
        Swal.fire({
          icon: 'success',
          title: 'Producto editado',
          text: 'El producto ha sido editado correctamente',
          confirmButtonText: 'Aceptar'
        });
        this.cerrarModalEditar();//Cerramos el modal de editar producto
      },
      error: (error) => {
        console.error('Error al editar el producto: ', error);
        Swal.fire({
          icon: 'error',
          title: 'Error !',
          text: 'Error al editar el producto',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  //Método para cerrar el modal
  cerrarModalEditar(){
    this.modalService.$modalEditarProducto.emit(false);//Emitimos el evento para cerrar el modal
  }

}
