export class PagoModel{
    constructor(
     public id:number,
     public code:string,
     public id_proveedor:number,
     public id_documento:number,
     public nroBoleta:string,
     public id_almacen:number,
     public tipoPago:string,
     public subtotal:number,
     public igv:number,
     public isc:number,
     public otro:number,
    ){}
}