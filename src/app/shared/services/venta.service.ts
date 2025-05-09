import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Venta } from '../models/Venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  //Esto es para actualizar la interfaz de lista de ventas
  private ventasUpdateSource = new BehaviorSubject<void>(undefined);
  ventasUpdate$ = this.ventasUpdateSource.asObservable();

  constructor(private http: HttpClient) { }

  //Método para actualizar la interfaz de lista de ventas
  notificarVentasUpdate(){
    this.ventasUpdateSource.next();
  }

  //Método para listar las ventas paginadas
  listVentasPaginadas(page: number, size: number){
    const params = new HttpParams().set('page', page.toString())
                                   .set('size', size.toString());    
    return this.http.get('http://localhost:8080/api/venta/list-page', { params });  
  }

  createVenta(venta: Venta): Observable<any>{
    return this.http.post('http://localhost:8080/api/venta/register', venta);

  }

  //Método para buscar venta por nombre del producto
  findVentaByNombreProducto(nombreProducto: string,page: number, size: number): Observable<any>{
    const params = new HttpParams().set('page', page.toString())
                                   .set('size', size.toString());    
    return this.http.get('http://localhost:8080/api/venta/buscar-nombre/' + nombreProducto, { params });  
  }

  //Método para buscar productos por nombre, y es para buscar dentro del componenete de agregar venta
  findProductoByNombreForVenta(nombreProducto: string): Observable<any>{
    return this.http.get('http://localhost:8080/api/producto/find/nombreProducto/venta/' + nombreProducto);
  }

  //Método para buscar ventas por el metodo de pago
  findVentasByMetodoPago(metodoPago: string, page: number, size: number): Observable<any>{
    const params = new HttpParams().set('page', page.toString())
                                   .set('size', size.toString()); 
    return this.http.get('http://localhost:8080/api/venta/buscar-metodoPago/' + metodoPago, { params });
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

  //Método para generar PDF de una venta
  generateVentaPDF(id: string): Observable<any>{
    return this.http.get('http://localhost:8080/api/venta/export/pdf/' + id, {responseType: 'blob'});
  }

  //Método para generar PDF de ventas entre fechas
  generateVentasPDFByFechas(fechaInicio: string, fechaFin: string): Observable<any>{
    const params = new HttpParams().set('fechaInicio', fechaInicio)
                                   .set('fechaFin', fechaFin);    
    return this.http.get('http://localhost:8080/api/venta/export/pdf/rango', {params, responseType: 'blob'});
  }

  //Método para listar los metodos de pago
  listMetodosPago(): Observable<any>{
    return this.http.get('http://localhost:8080/api/venta/metodos-pago');
  }
}
