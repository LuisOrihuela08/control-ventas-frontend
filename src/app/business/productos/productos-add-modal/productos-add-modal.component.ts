import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/services/modal.service';
import { Producto } from '../../../shared/models/Producto';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../../shared/services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos-add-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './productos-add-modal.component.html',
  styleUrl: './productos-add-modal.component.css'
})
export class ProductosAddModalComponent implements OnInit{

  producto: Producto = new Producto();
  productoForm!: FormGroup;
  constructor(private modalService: ModalService,
              private productoService: ProductoService,
              private fb: FormBuilder
  ){}
  
  ngOnInit(): void {
    this.productoForm = this.fb.group({
      nombreProducto: ['', Validators.required],
      marca: ['', Validators.required],
      cantidad: ['', Validators.required],
      precio_unitario: ['', Validators.required]
    });
    /*Esto es para ver lo que se va registrando*/
    console.log(this.productoForm.value);
    this.productoForm.valueChanges.subscribe((value) => {
      console.log('Valores actuales del formulario: ', value);
    }) 
  }

  /*Método para cerrar el Modal de Agregar Producto*/
  cerrarModalAgregarProducto(){
    this.modalService.$modalAgregarProducto.emit(false);
  }

  //Método para agregar producto
  agregarProducto(): void {

    // Verificar si hay campos vacíos
    if (this.productoForm.invalid) {
      console.log('Formulario inválido:', this.productoForm.invalid);
      Swal.fire({
              icon: "warning",
              title: "Formulario incompleto",
              text: "Por favor, completa todos los campos antes de continuar.",
              confirmButtonText: "Aceptar"
            });
      return;
    }

    // Obtener los valores del formulario
    const nuevoProducto = this.productoForm.value;

    //Llamamos al servicio para agregar el producto
    this.productoService.addProducto(nuevoProducto).subscribe({
      next: (response) => {
        console.log('Producto agregado exitosamente: ', response);
        Swal.fire({ 
          //position: "top-end",
          icon: "success",
          title: "Producto agregado",
          text: "El producto se ha agregado exitosamente.",
          confirmButtonText: "Aceptar"
        });
        //Aca notificamos al servicio que se actualizo el inventario de productos
        this.productoService.notificarProductosUpdate();
        // Resetear el formulario después de agregar el producto
        this.productoForm.reset();
        this.cerrarModalAgregarProducto(); // Cerrar el modal después de agregar el producto
      },
      error: (error) => {
        console.error('Error al agregar el producto: ', error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo agregar el producto. Por favor, inténtalo de nuevo.",
          confirmButtonText: "Aceptar"
        });
      }
    })
  }

  
}
