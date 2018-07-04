export class ImpuestoModel{
    constructor(
        public id:number,
        public nombre:string,
        public porcentaje:number,
        public descripcion:string,
        public tipo:string,
        public id_user:number
    ){}
}