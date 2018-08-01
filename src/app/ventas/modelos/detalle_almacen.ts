export class DetalleCaja{
    constructor(
      	public id: number,
        public id_caja: number,
		public id_usuario: number,
		public monto_apertura: string,
        public monto_cierre: string,
        public monto_actual:number,
        public abierta: boolean,
        public created_at:Date,
        public updated_at:Date,
	){}
}