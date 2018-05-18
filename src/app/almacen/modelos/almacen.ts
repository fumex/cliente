export class almacenstock{
    constructor(
        public id: number,
		public id_almacen: number,
		public id_producto: number,
		public stock: string,
        public precio_compra: number,
        public precio_venta: number
	){}
}