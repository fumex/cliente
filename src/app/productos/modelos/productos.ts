export class producto{
    constructor(
      	public id: number,
        public id_categoria: string,
		public nombre_producto: string,
		public descripcion: string,
		public unidad_de_medida: string,
		public cantidad: number
	){}
}