export class ClienteModel{
    constructor(
        public id:number,
        public nombre:string,
        public id_documento:number,
        public nro_documento:string,
        public direccion:string,
        public email:string,
        public telefono:string,
        public telefono2:string,
        public id_user:number
    ){}
}