export class DetalleNotaDevitoModel{
    constructor(
      	public id: number,
        public id_nota_debito: number,
		public id_detalle_venta: number,
		public correccion:string,
		public cantidad:number,
		public cantidad_total:number,
		public igv: number,
		public isc: number,
		public otro:number,  
		public cantidad_sinigv:number,
	){}
}