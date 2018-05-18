export class PagoDetalleModel{
    constructor(
     public id_pago:string,
     public id_producto:number,
     public cantidad:number,
     public id_unidad:number,
     public precio_unitario:number
    ){}
}