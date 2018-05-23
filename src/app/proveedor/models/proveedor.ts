export class ProveedorModel{
    
    constructor(
    public id:number,
    public nombre_proveedor:string,
    public ruc:string,
    public direccion:string,
    public telefono:string,
    public email:string,
    public tipo_proveedor:number
    ){}
}