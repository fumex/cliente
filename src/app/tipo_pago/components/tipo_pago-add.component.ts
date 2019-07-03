import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TipoPagoService } from '../services/tipo_pago.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { TipoPagoModel } from '../models/tipo_pago';
import { User } from '../../auth/interfaces/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ToastsManager } from 'ng2-toastr';
import { PermisosRolesModel } from '../../usuarios/modelos/permisos_roles';
import { UsuarioService } from '../../usuarios/services/usuarios.service';
import { environment } from '../../../environments/environment';

declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'tipoPago-add',
    templateUrl:'../views/tipo_pago-add.html',
    providers:[TipoPagoService,ToastService]
})
export class TipoPagoAddComponent implements OnInit{
    public title;
    public tipo_pago:TipoPagoModel;
    public tipo_pagos:TipoPagoModel[];
    public confirmado:boolean;
    public user:User;
    public url2;
    public mandar:PermisosRolesModel;
    constructor(
        private tipoPagoService:TipoPagoService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        
        private _UsuarioService:UsuarioService,
        vcr:ViewContainerRef 
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.title='Tipo de Pago';
        this.url2=environment.url+'admin/emisor';
        this.user=this.auth.getUser();
        this.mandar = new PermisosRolesModel(this.user.id,null,this.url2,null,null);
        let i=0;
        this._UsuarioService.getpermisos(this.mandar).subscribe(
            res=>{
                console.log(res)
                if(res.mensaje!=true){
                    this.router.navigate(['/'+this.user.rol]);
                }

            },
            err=>{
                console.log(<any>err);
            }
        );
        this.user=this.auth.getUser();
        this.tipo_pago= new TipoPagoModel(null,'','','',this.user.id);
        this.confirmado=true;
        //this.tabla();
    }
    ngOnInit(){


        this.getTipoPagos();
    }
    onSubmit(){
        console.log(this.tipo_pago);
        this.tipoPagoService.addTipoPago(this.tipo_pago).subscribe(
            result=>{
                console.log(result);
                this.clearTipoPago();
                this.destruir();
                this.alertaSave();
            },
            error=>{
                console.log(<any>error);
                let text="La Tipo de Pago existe";
                this.toaste.WarningAlert(text,'Error!');
                
            }
        );
    }
    onCancel(){
        this.clearTipoPago();
    }
    clearTipoPago(){
        this.tipo_pago=new TipoPagoModel(null,'','','',this.user.id);
    }
    //---------------------------------------------------------------------
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#tip').DataTable({
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ]
                 });
            });
        },3000);
    }
    getTipoPagos(){
        this.tipoPagoService.getTipoPagos().subscribe(
            result=>{
                this.tipo_pagos=result;
            },  
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        )
    }
    onDeleteTipoPagos(id){
        this.tipoPagoService.deleteTipoPago(id).subscribe(
            result=>{
                this.getTipoPagos();
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        )
    }
    edit(id){
        this.router.navigate(['/'+this.user.rol+'/tipo_pago/edit',id]);
        this.alertaUpdate();
    }
    alertaSave(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Guardado...',
            buttons: false,
            timer: 2000,
        })   
    }
    alertaUpdate(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Cargando...',
            buttons: false,
            timer: 2000,
        })   
    }
    alertaDelete(id){
        let identi=id;
        swal({
            title: "esta seguro",
            text: "despúes de borrar, no se pude recuperar",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.onDeleteTipoPagos(identi);
                this.destruir();
                swal({
                    position: 'center',
                    icon: "error",
                    title: 'eliminado...',   
                    timer: 3000,
                    buttons: false,
                });
            } else {
              
            }
          });
    }

    destruir(){	
        var table = $('#tip').DataTable(); table .clear() ;
        $('#tip').DataTable().destroy();
        this.reconstruir();
    }
    reconstruir(){
        this.tabla();
        this.getTipoPagos();
    }
}