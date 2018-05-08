export class producto{
    constructor(
        public id: number,
        public id_categoria: number,
		public nombre_producto: string,
		public descripcion: string,
		public unidad_de_medida: string,
		public precio: number
	){}
}