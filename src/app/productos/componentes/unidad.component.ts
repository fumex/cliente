import { Component,ViewContainerRef } from "@angular/core";
import { UnidadesModel } from "../modelos/unidades";
import { UnidadService } from '../services/unidad.service';
import { ProductosComponent } from './productos.component';
import { User } from "../../auth/interfaces/user.model";
import { AuthService } from "../../auth/services/auth.service";

import {ToastService} from '../../toastalert/service/toasts.service'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
    selector:'unidades',
    templateUrl:'../views/unidad.component.html',
    providers:[UnidadService]
})
export class unidadcomponent{
    public unidades:UnidadesModel;
    public titulo;
    public user:User;
    public nombre;
    constructor(
        private _UnidadService:UnidadService,
        private _productoscomponent:ProductosComponent,
        private auth:AuthService,
        private toaste:ToastService,
        public toastr: ToastsManager,
        vcr: ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.user=this.auth.getUser();
        this.unidades = new UnidadesModel(null,'','',this.user.id);
        this.titulo="agregar unidad";
    }
    exit(){
        this._productoscomponent.getexituni();
    }

    guardarunidad(){
        this.nombre =document.getElementById('unidadess');
        //this.categoria = new categoria(tipo1);
        console.log(this.unidades);
        this._UnidadService.addunidad(this.unidades).subscribe(
            response=>{
                console.log(response);
                if(response.code==300){
                    let text="esa abreviacion ya existe ("+response.seleccionado +")";
                    this.toaste.errorAlerta(text,'Error!');
                    this.unidades.unidad=null;
                    this.unidades.abreviacion=null;
                }else{
                    this.unidades = new UnidadesModel(null,'','',this.user.id);
                    this._productoscomponent.mostarunidad();
                    //this.alertaecho();
                    this.exit();
                }
                
            },
            error=>{
                console.log(<any>error);
                //this.alertaerror();
                if(error.status==500){
                    let text="la unidad ya existe";
                    this.toaste.errorAlerta(text,'Error!');
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
            timer: 3000
          })
    }
    alertaecho(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Insertado',
            text:'La Unidad se agrego correctamente',
            buttons: true,
            timer: 1500
          })
    }
}