export class PagoDetalleModel{
    constructor(
     public id_pago:string,
     public id_producto:number,
     public cantidad:number,
     public precio_unitario:number,
     public vendible:boolean
    ){}
}