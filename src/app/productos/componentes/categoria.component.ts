import { Component } from "@angular/core";
import { CategoriaService } from "../../categorias/services/services.categoria";
import { categoria } from '../../categorias/modelos/categorias';
import { ProductosComponent } from './productos.component';
import { User } from "../../auth/interfaces/user.model";
import { AuthService } from "../../auth/services/auth.service";


@Component({
    selector:'categoria',
    templateUrl:'../views/categorias.component.html',
    providers:[CategoriaService]
})
export class categoriacomponent{
    public categoria:categoria;
    public titulo;
    public user:User;
    constructor(
        private _categoriaservice:CategoriaService,
       private _productoscomponent:ProductosComponent,
       private auth:AuthService
    ){
        this.titulo="añadir categoria"
        this.user=auth.getUser();
        this.categoria = new categoria(null,'',this.user.id);
        
    }
    exit(){
        this._productoscomponent.getexitcate();
    }

    guardarcategoria(){
        //this.categoria = new categoria(tipo1);
        console.log(this.categoria);
        this._categoriaservice.addCategoria(this.categoria).subscribe(
            response=>{
                console.log(response);
                this.categoria = new categoria(null,'',this.user.id);
                this._productoscomponent.mostrarcategoria();
                this.exit();
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
}