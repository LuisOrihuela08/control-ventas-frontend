import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http: HttpClient) { }

  //Método para listar los productos paginados
  listProductosPaginados(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page.toString())
      .set('size', size.toString());
    return this.http.get('http://localhost:8080/api/producto/list-page', { params });
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
}