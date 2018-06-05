export class ServicioAddModel{
    constructor(
     public id:number,
     public code:string,
     public id_documento:number,
     public nroBoleta:string,
     public tipo_pago:string,
     public id_proveedor:number,
     public descripcion:string,
     public subtotal:number,
     public igv:number
    ){}
}