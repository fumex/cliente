export class PermisosRolesModel{
    constructor(
      	public id: number,
        public id_user:number,
        public url:string,
        public tipo_permiso:string,
        public estado:boolean,
	){}
}