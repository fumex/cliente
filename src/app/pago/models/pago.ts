export class PagoModel{
    constructor(
     public code:string,
     public id_proveedor:number,
     public nroBoleta:string,
     public tipoPago:string
    ){}
}