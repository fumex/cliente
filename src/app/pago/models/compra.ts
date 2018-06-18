export class CompraModel{
    constructor(
     public ind:number,
     public id:number,
     public nombre:string,
     public unidad_medida:string,
     public codigo:string,
     public nombre_producto:string,
     public descripcion:string,
     public cantidad:number,
     public precio:number
    ){}
}