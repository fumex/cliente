export class codproMdel{
    constructor(
     public id:number,
     public id_producto:number,
     public nombre_producto:string,
     public numero_de_serie:string,
     public codigo_interno:string,
     public codigo_automatico:string,
     public id_detalle_pago:number,
     public vendible:boolean,
     public fecha_vencimiento:Date,
     public id_almacen:number,
     public id_usuario:number,
     public id_detalle_almacen:number,
    ){}
}