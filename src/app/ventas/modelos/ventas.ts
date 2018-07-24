export class VentasModel{
    constructor(
      	public id: number,
        public id_cliente: number,
		public numero_documento: string,
		public id_caja: number,
        public total: number,
        public impuestos: number,
        public recivido: number,
        public estado: boolean,
	){}
}