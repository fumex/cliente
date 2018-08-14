export class inventario{
    constructor(
        public id: number,
		public fecha: string,
		public descripcion: string,
		public id_producto: number,
        public id_almacen: number,
        public tipo_movimiento: number,
        public cantidad: number,
        public opciones: string,
        public precio:number,
        public escoja:number,
        public usuario:number,
        public codigo:number,
	){}
}