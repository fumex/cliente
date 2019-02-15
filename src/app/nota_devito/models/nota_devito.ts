export class NotaDevitoModel{
    constructor(
      	public id: number,
        public tipo_nota: string,
		public id_venta: number,
		public serie:string,
		public numero:string,
		public motivo: string,
		public id_usuario:number, 
		public serie_nota:string,
		public aumento: number,
		public email:string,
		public letrado:string,
		public subtotal:number,
		public total:number,
		public fecha:string,
	){}
}