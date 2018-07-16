export class ProductoDetalleModel{
    constructor(
      	public id: number,
		public nombre_producto: string,
		public impuesto: string,
		public porcentaje: number,
		public tipo:string,
	){}
}