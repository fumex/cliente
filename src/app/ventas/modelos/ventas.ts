export class VentasModel{
    constructor(
      	public id: number,
        public id_cliente: number,
        public serie_venta: string,
        public tarjeta: string,
		public id_caja: number,
        public total: number,
        public pago_efectivo: number,
        public pago_tarjeta: number,
        public fecha:Date ,
        public estado: boolean,
        public id_usuario:number,
        public id_moneda:number,
        public igv:number,
        public isc:number,
        public otro:number,
        public tipopago:number,
	){}
}