export class PagoAnulaModel{
    constructor(
     public id:number,
     public code:string,
     public id_prove:number,
     public nombre_proveedor:string,
     public documento:string,
     public nroBoleta:string,
     public almacen:string,
     public tipoPago:string,
     public subtotal:number,
     public igv:number,
     public exonerados:number,
     public gravados:number,
     public otro:number,
     public created_at:string
    ){}
}