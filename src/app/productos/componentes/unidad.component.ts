import { Component } from "@angular/core";
import { UnidadesModel } from "../modelos/unidades";
import { UnidadService } from '../services/unidad.service';
import { ProductosComponent } from './productos.component';
import { User } from "../../auth/interfaces/user.model";
import { AuthService } from "../../auth/services/auth.service";


@Component({
    selector:'unidades',
    templateUrl:'../views/unidad.component.html',
    providers:[UnidadService]
})
export class unidadcomponent{
    public unidades:UnidadesModel;
    public titulo;
    public user:User;
    constructor(
        private _UnidadService:UnidadService,
        private _productoscomponent:ProductosComponent,
        private auth:AuthService
    ){
        this.user=this.auth.getUser();
        this.unidades = new UnidadesModel(null,'','',this.user.id);
        this.titulo="agregar unidad";
    }
    exit(){
        this._productoscomponent.getexituni();
    }

    guardarunidad(){
        //this.categoria = new categoria(tipo1);
        console.log(this.unidades);
        this._UnidadService.addunidad(this.unidades).subscribe(
            response=>{
                console.log(response);
                this.unidades = new UnidadesModel(null,'','',this.user.id);
                this._productoscomponent.mostarunidad();
                this.exit();
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
}