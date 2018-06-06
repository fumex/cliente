export class CompraAnularModel{
    constructor(
     public id:number,
     public id_pago:string,
     public id_producto:number,
     public nombre_producto:string,
     public id_almacen:number,
     public nombre:string,
     public cantidad:number,
     public precio_unitario:number
    ){}
}