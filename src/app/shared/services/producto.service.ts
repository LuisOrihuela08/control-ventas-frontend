import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto } from '../models/Producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  //Esto es para actualizar el inventario de productos
  private productosUpdateSource =new BehaviorSubject<void>(undefined);//esto es para actualizar el inventario de productos
  productosUpdate$ = this.productosUpdateSource.asObservable();//esto es para actualizar el inventario de productos

  constructor(private http: HttpClient) { }

  //Método para actualizar el inventario de productos
  notificarProductosUpdate(){
    this.productosUpdateSource.next();
  }

  //Método para listar los productos paginados
  listProductosPaginados(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page.toString())
      .set('size', size.toString());
    return this.http.get('http://localhost:8080/api/producto/list-page', { params });
  }

  //Método para agregar producto
  addProducto(producto: Producto): Observable<any>{
    return this.http.post('http://localhost:8080/api/producto/register', producto);
  }

  //Método para eliminar producto
  deleteProducto(id: string): Observable<any>{
    return this.http.delete('http://localhost:8080/api/producto/delete/' + id);
  }

  //Método para buscar producto por nombre
  getProductoByNombre(nombreProducto: string, page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page.toString())
      .set('size', size.toString());
    return this.http.get('http://localhost:8080/api/producto/find-nombre/' + nombreProducto, { params });
  }

  //Método para buscar por marca
  getProductoByMarca(marca: string, page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page.toString())
      .set('size', size.toString());
    return this.http.get('http://localhost:8080/api/producto/find-marca/' + marca, { params });
  }

  //Método para descargar el inventario de productos en excel
  downloadExcel(){
    return this.http.get('http://localhost:8080/api/producto/inventario-excel', { responseType: 'blob' });
  }

  //Método para descargar el inventario de productos en pdf
  downloadPDF(){
    return this.http.get('http://localhost:8080/api/producto/inventario-pdf', { responseType: 'blob' });
  }

  //Método para importar el inventario de productos desde un archivo excel
  importExcel(file: File): Observable<any>{
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post('http://localhost:8080/api/producto/importar-excel', formData, {
      reportProgress: true,//esto es para mostrar el progreso de la carga del archivo
      observe: 'events'//esto es para observar el progreso de la carga del archivo
    });
  }
}