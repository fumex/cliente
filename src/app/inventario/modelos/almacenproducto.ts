export class ProductosfiltradoporAlmacenModel{
    constructor(
        public id: number,
		public nombre_producto: string,
		public descripcion: string,
		public unidad_de_medida: number,
        public cantidad: number,
        public nombre:string,
        public stock: number,
        public canti:number,
	){}
}