export class TipoPagoModel{
    constructor(
        public id:number,
        public nombre:string,
        public descripcion:string,
        public tipo:string,
        public id_user:number
    ){}
}