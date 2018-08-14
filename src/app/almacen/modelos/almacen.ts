export class almacenstock{
    constructor(
        public id: number,
        public id_almacen: number,
        public codigo:string,
        public vendible:boolean,
		public id_producto: number,
		public stock: number,
        public precio_compra: number,
        public precio_venta: number,
        public descuento_maximo:number
	){}
}