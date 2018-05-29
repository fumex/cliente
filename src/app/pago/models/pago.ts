export class PagoModel{
    constructor(
     public code:string,
     public id_documento:number,
     public id_proveedor:number,
     public nroBoleta:string,
     public id_almacen:number,
     public tipoPago:string
    ){}
}