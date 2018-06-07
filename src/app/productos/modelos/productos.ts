export class producto{
    constructor(
      	public id: number,
        public id_categoria: string,
		public nombre_producto: string,
		public descripcion: string,
		public abreviacion: string,
		public cantidad: number,
		public id_user:number
	){}
}