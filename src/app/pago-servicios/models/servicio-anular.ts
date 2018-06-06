export class ServicioAnularModel{
    constructor(
     public id:number,
     public code:string,
     public documento:string,
     public nroBoleta:string,
     public tipo_pago:string,
     public nombre_proveedor:string,
     public descripcion:string,
     public subtotal:number,
     public igv:number,
     public created_at:string
    ){}
}