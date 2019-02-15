export class codigoProductosModel{
    constructor(
      	public id: number,
        public id_detalle_pago: number,
        public id_codigo_producto: number,
        public cantidad: number,
        public cantidad_maxima:number,
        public serie:string
	){}
}