import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  //Esto es para productos
  $modalAgregarProducto = new EventEmitter<any>();
  $modalEditarProducto = new EventEmitter<any>();

  //Esto es para ventas
  $modalReporteVentasMetodoPago = new EventEmitter<any>();
}
