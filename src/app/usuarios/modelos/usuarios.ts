export class UsuarioModel{
    constructor(
      	public id: number,
        public name: string,
		public apellidos: string,
		public id_documento: number,
		public numero_documento: number,
        public direccion: string,
        public telefono:number,
        public email:string,
        public nacimiento:string,
        public rol:string,
        public confirme:string,
        public nuevo:string,
        public password:string,
        public imagen:string,
	){}
}