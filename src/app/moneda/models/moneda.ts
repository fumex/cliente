export class MonedaModel{
    constructor(
        public id:number,
        public moneda:string,
        public tasa:number,
        public id_user:number,
        public codigo_sunat:string,
        public pais_referencia:string,
    ){}
}