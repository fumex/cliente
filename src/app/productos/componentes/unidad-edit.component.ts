import { Component,ViewContainerRef } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UnidadService } from "../services/unidad.service";
import { UnidadesModel } from '../modelos/unidades';
import { ProductosComponent } from './productos.component';
import { User } from "../../auth/interfaces/user.model";
import { AuthService } from "../../auth/services/auth.service";

import {ToastService} from '../../toastalert/service/toasts.service'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

declare var jQuery:any;
declare var $:any;
declare var swal:any;

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
    public user:User;
    public viejonombre;
    public viejaavreviacion;
    public nombre;
    constructor(
        private _UnidadService:UnidadService,
        private _route: ActivatedRoute,
       private _productoscomponent:ProductosComponent,
       private auth:AuthService,
       private toaste:ToastService,
        public toastr: ToastsManager,
        vcr: ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.user=this.auth.getUser();
        this.unidades = new UnidadesModel(null,'','',this.user.id);
        
        this.id=0;
        this.titulo="editar unidad"
        this.id=this._productoscomponent.modificarcategoria;

        this.viejonombre=null;
        this.viejaavreviacion=null;
    }
    exit(){
        this._productoscomponent.getexituni();
    }
    ngOnInit(){
        this.getunidad();
    }
    actualizarunidad(){
        this.nombre =document.getElementById('unidad');
        console.log(this.unidades)
        //this.unidades=new UnidadesModel(null,'','');
        //this.unidades=this.unidades;
        //console.log(this.unidades)
        this._UnidadService.updateunidad(this.id,this.unidades).subscribe(
            response=>{
                console.log(response);
                if(response.code==300){
                    let text="esa abreviacion ya existe ("+response.seleccionado +")";
                    this.toaste.errorAlerta(text,'Error!');
                    this.unidades.unidad=this.viejonombre;
                    this.unidades.abreviacion=this.viejaavreviacion;
                    
                }else{
                    this._productoscomponent.mostarunidad();
                    this.exit();
                    //this.alertaecho();
                }
                
            },
            error=>{
                this.alertaerror();
                console.log(<any>error);
                if(error.status==500){
                    let text="la unidad ya existe";
                    this.toaste.errorAlerta(text,'Error!');
                    //this.unidades.unidad=this.viejonombre;
                    this.unidades.abreviacion=this.viejaavreviacion;
                    this.nombre.focus();
                    this.nombre.select();
                }
            }
        );
    }
    getunidad(){
        this.id=this._productoscomponent.unidad;
		this._UnidadService.selectunidad(this.id).subscribe(
			response => {
                this.unidades = response;
                this.viejonombre=response.unidad;
                this.viejaavreviacion=response.abreviacion;
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
            text:'La Unidad se edito correctamente',
            buttons: true,
            timer: 1500
          })
    }
}