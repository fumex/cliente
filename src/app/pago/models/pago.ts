export class PagoModel{
    constructor(
     public id:number,
     public code:string,
     public fecha:Date,
     public id_proveedor:number,
     public id_documento:number,
     public nroBoleta:string,
     public id_almacen:number,
     public tipoPago:string,
     public subtotal:number,
     public igv:number,
     public exonerados:number,
     public gravados:number,
     public otro:number,
    ){}
}