import { Component ,ViewContainerRef} from "@angular/core";
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
    selector:'categoria',
    templateUrl:'../views/categorias.component.html',
    providers:[CategoriaService,ToastService]
})
export class categoriacomponent{
    public categoria:categoria;
    public titulo;
    public user:User;
    public nombre;
    constructor(
        private _categoriaservice:CategoriaService,
       private _productoscomponent:ProductosComponent,
       private auth:AuthService,
       private toaste:ToastService,
       public toastr: ToastsManager,
       vcr: ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.titulo="añadir categoria"
        this.user=auth.getUser();
        this.categoria = new categoria(null,'',this.user.id);
        
    }
    exit(){
        
        this._productoscomponent.getexitcate();
    }

    guardarcategoria(){
        this.nombre =document.getElementById('cteria');
        console.log(this.categoria);
        this._categoriaservice.addCategoria(this.categoria).subscribe(
            response=>{
                console.log(response);
                this.categoria = new categoria(null,'',this.user.id);
                this._productoscomponent.mostrarcategoria(response.code);
                //this.alertaecho();
                //this.toaste.errorAlerta('la categoria se inserto','Guardado');
                this.exit();
            },
            error=>{
                console.log(<any>error);
                //this.alertaerror();
                if(error.status==500){
                    let text="la categoria ya existe";
                    this.toaste.errorAlerta("la categoria ya existe",'Error!');
                    this.nombre.focus();
                    this.nombre.select();
                }
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
            timer: 1500
          })
    }
    alertaecho(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Insertado',
            text:'La Categoria se agrego correctamente',
            buttons: true,
            timer: 3000
          })
    }
}