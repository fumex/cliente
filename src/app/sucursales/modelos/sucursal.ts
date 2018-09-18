export class SucursalModel{
    constructor(
        public id: number,
        public nombre_sucursal: string,
        public id_almacen: number,
        public descripcion: string,
        public direccion: string,
        public telefono:string,
        public telefono2:string,
        public id_user:number,
    ){}
}   