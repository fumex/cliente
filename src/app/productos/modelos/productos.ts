export class producto{
    constructor(
      	public id: number,
        public id_categoria: string,
		public nombre_producto: string,
		public descripcion: string,
		public unidadmedida: string,
		public cantidad: number
	){}
}