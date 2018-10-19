export class AnularDetalleModel{
    constructor(
      	public id: number,
        public id_nota_credito: number,
		public id_detalle_venta: number,
		public correccion:string,
		public cantidad:number,
		public cantidad_total:number,
		public igv: number,
		public isc: number,
		public otro:number,  
	){}
}