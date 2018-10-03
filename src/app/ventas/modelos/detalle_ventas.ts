export class DetalleVentasModel{
    constructor(
      	public id: number,
        public id_venta: number,
		public id_producto: number,
        public cantidad: number,
        public codigo: number,
        public precio_unitario: number,
        public descripcion:string,
        public igv:number,
        public isc:number,
        public otro:number,
        public estado: boolean,
        public descuento_maximo:number,
        public descuento:number,
        public descuento_cant:number,
        public igv_id:number,
        public isc_id:number,
        public otro_id:number,
	){}
}