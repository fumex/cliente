import { Component,ViewContainerRef } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CategoriaService } from "../../categorias/services/services.categoria";
import { categoria } from '../../categorias/modelos/categorias';
import { ProductosComponent } from './productos.component';
import { User } from "../../auth/interfaces/user.model";
import { AuthService } from "../../auth/services/auth.service";

import {ToastService} from '../../toastalert/service/toasts.service'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

declare var jQuery:any;
declare var $:any;
declare var swal:any;

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
    public viejonombre;
    constructor(
        private _categoriaservice:CategoriaService,
        private _route: ActivatedRoute,
       private _productoscomponent:ProductosComponent,
       private auth:AuthService,
       private toaste:ToastService,
       public toastr: ToastsManager,
       vcr: ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.user=this.auth.getUser();
        this.categoria = new categoria(null,'',this.user.id);
        
        this.id=0;
        this.titulo="editar categoria"
        this.id=this._productoscomponent.modificarcategoria;

        this.viejonombre=null;
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
                this._productoscomponent.mostrarcategoria(response.code);
                //this.alertaecho();
                this.exit();
            },
            error=>{
                console.log(<any>error);
                this.alertaerror();
                if(error.status==500){
                    let text="la categoria ya existe";
                    this.toaste.errorAlerta(text,'Error!');
                    this.categoria.nombre= this.viejonombre;
                }
            }
        );
    }
    getcategoria(){
        this.id=this._productoscomponent.modificarcategoria;
		this._categoriaservice.selectcategoria(this.id).subscribe(
			response => {
                this.categoria = response;
                this.viejonombre=response.nombre;
			},
			error => {
				console.log(<any>error);
			}
		);
	
    }
    alertaerror(){
        swal({
            position: 'center',
            icon: "warning",
            title: 'ocurio un error ',
            text:'intentelo de nuevo mas tarde',
            buttons: true,
            timer: 3000
          })
    }
    alertaecho(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Insertado',
            text:'La Categoria se edito correctamente',
            buttons: true,
            timer: 1500
          })
    }
}