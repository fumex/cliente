import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CategoriaService } from "../../categorias/services/services.categoria";
import { categoria } from '../../categorias/modelos/categorias';
import { ProductosComponent } from './productos.component';


@Component({
    selector:'edit',
    templateUrl:'../views/categorias.component.html',
    providers:[CategoriaService]
})
export class categoriaedit{
    public categoria:categoria;
    public id;
    public titulo;
    constructor(
        private _categoriaservice:CategoriaService,
        private _route: ActivatedRoute,
       private _productoscomponent:ProductosComponent
    ){
        this.categoria = new categoria(null,'');
        this.id=0;
        this.titulo="editar categoria"
        this.id=this._productoscomponent.modificar;
    }
    exit(){
        this._productoscomponent.getexit();
    }
    ngOnInit(){
        this.getProducto();
    }
    onSubmit(){
        this.actualizarcategoria();
    }
    actualizarcategoria(){
        //this.categoria = new categoria(tipo1);
        
        this._categoriaservice.actualizarcategoria(this.id,this.categoria).subscribe(
            response=>{
                console.log(response);
                this.exit();
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    getProducto(){
        this.id=this._productoscomponent.modificar;
		this._categoriaservice.selectcategoria(this.id).subscribe(
			response => {
				this.categoria = response;
			},
			error => {
				console.log(<any>error);
			}
		);
	
	}
}