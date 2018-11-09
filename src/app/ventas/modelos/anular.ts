export class AnularModel{
    constructor(
      	public id: number,
        public tipo_nota: string,
		public id_venta: number,
		public serie:string,
		public numero:string,
		public motivo: string,
		public correccion_ruc: string,
		public id_usuario:number, 
		public serie_nota:string,
		public descuento: number,
		public serie_venta_remplazo:string,
		public email:string,
		public letrado:string,
	){}
}