import { Component } from "@angular/core";
import { TipoProveedorService } from "../services/tipoProveedor.service";
import { TipoProveedorModel } from "../models/tipoProveedor";
import { ProveedorAddComponent } from "./proveedor-add.component";


@Component({
    selector:'tipo-proveedor',
    templateUrl:'../views/tipo-proveedor.html',
    providers:[TipoProveedorService]
})
export class TipoProveedor{
    public tipo:TipoProveedorModel;
    constructor(
        private tipoProveedorService:TipoProveedorService,
        private proveedorComponent:ProveedorAddComponent
    ){
        this.tipo = new TipoProveedorModel(null);
    }
    exit(){
        this.proveedorComponent.getExit();
    }
    saveTipo(tipo1:string){
        this.tipo = new TipoProveedorModel(tipo1);
        console.log(this.tipo);
        this.tipoProveedorService.addTipo(this.tipo).subscribe(
            response=>{
                console.log(response);
                this.exit();
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
}
