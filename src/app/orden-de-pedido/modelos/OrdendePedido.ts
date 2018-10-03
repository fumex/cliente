export class OrdenDePedidoModel{
    constructor(
		public id: number,
		//public code:string,
		public created_at: Date,
		public id_proveedor:number,
		public id_almacen: number,
		public terminos:string,
		public fecha_estimada_entrega: Date,
	){}
}