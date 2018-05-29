export class DetalleOrdenDePedidoModel{
    constructor(
      	public id: number,
        public id_orden_pedido: number,
		public id_producto: string,
		public cantidad: number,
	){}
}