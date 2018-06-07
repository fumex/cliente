import { Component } from "@angular/core";
import { UnidadesModel } from "../modelos/unidades";
import { UnidadService } from '../services/unidad.service';
import { ProductosComponent } from './productos.component';


@Component({
    selector:'unidades',
    templateUrl:'../views/unidad.component.html',
    providers:[UnidadService]
})
export class unidadcomponent{
    public unidades:UnidadesModel;
    public titulo;
    constructor(
        private _UnidadService:UnidadService,
       private _productoscomponent:ProductosComponent
    ){
        this.unidades = new UnidadesModel(null,'','');
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
                this.unidades = new UnidadesModel(null,'','');
                this._productoscomponent.mostarunidad();
                this.exit();
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
}