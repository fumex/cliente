export class TipoPagoModel{
    constructor(
        public id:number,
        public codigo_sunat:string,
        public descripcion:string,
        public tipo:string,
        public id_user:number
    ){}
}