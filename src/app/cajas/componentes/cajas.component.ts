import { Component,ViewContainerRef } from "@angular/core";
import { CajasModels } from "../modelos/cajas";
import { CajasService } from '../services/cajas.services';
import { User } from "../../auth/interfaces/user.model";
import { AuthService } from "../../auth/services/auth.service";
import {SucursalService} from '../../sucursales/services/sucursal.service';
import {SucursalModel} from '../../sucursales/modelos/sucursal';
import {ToastService} from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
    selector:'cajas',
    templateUrl:'../views/cajas.component.html',
    providers:[CajasService,ToastService,SucursalService]
})
export class CajasComponent{
    public cajas:CajasModels;
    public sucursales:SucursalModel;
    public titulo;
    public user:User;
    public nombre;
    constructor(
        private _cajasservice:CajasService,
        private _SucursalService:SucursalService,
        private auth:AuthService,
        private toaste:ToastService,
        public toastr: ToastsManager,
        vcr: ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.user=this.auth.getUser();
        this.cajas = new CajasModels(null,null,null,null,null,this.user.id);
        this.titulo="Cajas";
    }
    ngOnInit(){
        this.mostrarcajas();
        this.mostarsucursales();
    }
    mostrarcajas(){
        this._cajasservice.getcajas().subscribe(
            res=>{
                console.log(res);
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    mostarsucursales(){
        this._SucursalService.getsucursal().subscribe(
            res=>{
                console.log(res);
                this.sucursales=res;
            },
            err=>{
                console.log(<any>err)
            }
        );
    }
    guardarCaja(){
      
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
            text:'La Caja se agrego correctamente',
            buttons: true,
            timer: 1500
          })
    }
}