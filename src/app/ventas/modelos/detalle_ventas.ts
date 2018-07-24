export class DetalleVentasModel{
    constructor(
      	public id: number,
        public id_venta: number,
		public id_producto: number,
		public cantidad: number,
        public precio_unitario: number,
        public descripcion:string,
        public estado: boolean,
	){}
}