export class PagoAnulaModel{
    constructor(
     public id:number,
     public code:string,
     public nombre_proveedor:string,
     public documento:string,
     public nroBoleta:string,
     public almacen:string,
     public tipoPago:string,
     public subtotal:number,
     public igv:number,
     public created_at:string
    ){}
}