export class DetalleCaja{
    constructor(
      	public id: number,
        public id_caja: number,
		public id_usuario: number,
		public monto_apertura: number,
		public monto_cierre: number,
        public abierta: boolean,
        public created_at:Date,
        public updated_at:Date,
	){}
}