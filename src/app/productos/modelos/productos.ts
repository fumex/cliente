export class producto{
    constructor(
      	public id: number,
		public id_categoria: number,
		public nombre_producto: string,
		public descripcion: string,
		public abreviacion: string,
		public cantidad: number,
		public id_user:number,
		public id_unidad: number,
		public imagen: string,
		public marca: string,
		public modelo: string,
		public observaciones: string,
	){}
}