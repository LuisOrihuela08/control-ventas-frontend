import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  constructor(private http: HttpClient) { }

  //Método para listar las ventas paginadas
  listVentasPaginadas(page: number, size: number){
    const params = new HttpParams().set('page', page.toString())
                                   .set('size', size.toString());    
    return this.http.get('http://localhost:8080/api/venta/list-page', { params });  
  }

  //Método para buscar venta por nombre del producto
  findVentaByNombreProducto(nombreProducto: string,page: number, size: number): Observable<any>{
    const params = new HttpParams().set('page', page.toString())
                                   .set('size', size.toString());    
    return this.http.get('http://localhost:8080/api/venta/buscar-nombre/' + nombreProducto, { params });  
  }

  //Método para buscar ventas por intervalos de fechas
  findVentaByFechasBetween(fechaInicio: string, fechaFin: string, page: number, size: number): Observable<any>{
    const params = new HttpParams().set('page', page.toString())
                                   .set('size', size.toString())
                                   .set('fechaInicio', fechaInicio)
                                   .set('fechaFin', fechaFin);    
    return this.http.get('http://localhost:8080/api/venta/buscar-por-fecha', { params });  
  }

  //Método para generar el reporte de ventas por metodo de pago
  createReportVentasByMetodoPago(): Observable<any>{
    return this.http.get('http://localhost:8080/api/venta/total-ventas/metodo-pago');
  }
}
