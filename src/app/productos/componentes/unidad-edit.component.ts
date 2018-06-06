import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UnidadService } from "../services/unidad.service";
import { UnidadesModel } from '../modelos/unidades';
import { ProductosComponent } from './productos.component';


@Component({
    selector:'unidades-edit',
    templateUrl:'../views/unidad.component.html',
    providers:[UnidadService]
})
export class unidadesedit{
    public unidades:UnidadesModel;
    public unidad;
    public id;
    public titulo;
    constructor(
        private _UnidadService:UnidadService,
        private _route: ActivatedRoute,
       private _productoscomponent:ProductosComponent
    ){
        this.unidades = new UnidadesModel(null,'','');
        
        this.id=0;
        this.titulo="editar unidad"
        this.id=this._productoscomponent.modificarcategoria;
    }
    exit(){
        this._productoscomponent.getexit();
    }
    ngOnInit(){
        this.getunidad();
    }
    actualizarunidad(){
        console.log(this.unidades)
        //this.unidades=new UnidadesModel(null,'','');
        //this.unidades=this.unidades;
        //console.log(this.unidades)
        this._UnidadService.updateunidad(this.id,this.unidades).subscribe(
            response=>{
                console.log(response);
                this._productoscomponent.mostarunidad();
                this.exit();
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    getunidad(){
        this.id=this._productoscomponent.unidad;
		this._UnidadService.selectunidad(this.id).subscribe(
			response => {
				this.unidades = response;
			},
			error => {
				console.log(<any>error);
			}
		);
	
	}
}