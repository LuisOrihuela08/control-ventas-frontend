import { Producto } from "./Producto";

export class Venta{
    id: string = '';
    productos_vendidos: Producto[] =[];
    monto_total: number = 0;
    metodoPago: string = '';
    dinero_cliente: number = 0;
    vuelto : number = 0;
    fechaCompra: Date = new Date();
}