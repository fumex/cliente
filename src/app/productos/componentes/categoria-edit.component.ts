import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CategoriaService } from "../../categorias/services/services.categoria";
import { categoria } from '../../categorias/modelos/categorias';
import { ProductosComponent } from './productos.component';
import { User } from "../../auth/interfaces/user.model";
import { AuthService } from "../../auth/services/auth.service";


@Component({
    selector:'categoria-edit',
    templateUrl:'../views/categorias.component.html',
    providers:[CategoriaService]
})
export class categoriaedit{
    public categoria:categoria;
    public categorias;
    public id;
    public titulo;
    public user:User;
    constructor(
        private _categoriaservice:CategoriaService,
        private _route: ActivatedRoute,
       private _productoscomponent:ProductosComponent,
       private auth:AuthService
    ){
        this.user=this.auth.getUser();
        this.categoria = new categoria(null,'',this.user.id);
        
        this.id=0;
        this.titulo="editar categoria"
        this.id=this._productoscomponent.modificarcategoria;
    }
    exit(){
        this._productoscomponent.getexitcate();
    }
    ngOnInit(){
        this.getcategoria();
    }
    actualizarcategoria(){
        console.log(this.categorias)
        this.categorias=new categoria(null,'',this.user.id);
        this.categorias=this.categoria;
        console.log(this.categorias)
        this._categoriaservice.actualizarcategoria(this.id,this.categoria).subscribe(
            response=>{
                console.log(response);
                this._productoscomponent.mostrarcategoria();
                this.exit();
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    getcategoria(){
        this.id=this._productoscomponent.modificarcategoria;
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