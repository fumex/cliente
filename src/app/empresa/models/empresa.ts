export class EmpresaModel{
    constructor(
        public id:number,
        public razon_social:string,
        public ruc:string,
        public direccion:string,
        public departamento:string,
        public provincia:string,
        public distrito:string,
        public telefono1:string,
        public telefono2:string,
        public web:string,
        public email:string,
        public imagen:string,
        public id_user:number,
        public ubigeo:string,
        public retencion:boolean,
        public percepcion:boolean,
        public nombre_comercial:string
    ){}
}