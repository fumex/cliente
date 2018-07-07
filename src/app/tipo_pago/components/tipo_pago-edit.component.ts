import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TipoPagoService } from '../services/tipo_pago.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { TipoPagoModel } from '../models/tipo_pago';
import { User } from '../../auth/interfaces/user.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ToastsManager } from 'ng2-toastr';

declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'tipoPago-edit',
    templateUrl:'../views/tipo_pago-add.html',
    providers:[TipoPagoService, ToastService]
})
export class TipoPagoEditComponent implements OnInit{
    public title;
    public tipo_pago:TipoPagoModel;
    public user:User;
    public confirmado:boolean;
    public tipo_pagos:TipoPagoModel[];
    constructor(
        private tipoPagoService:TipoPagoService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.user=auth.getUser();
        this.title='Editar Tipo de Pago'
        this.tipo_pago= new TipoPagoModel(null,'','','',this.user.id);
        this.confirmado=false;
        this.tabla();
    }
    ngOnInit(){
        this.getTipoPago();
        this.getTipoPagos();      
    }
    getTipoPago(){
        this.route.params.forEach((params:Params)=>{
            let id=params['id'];
            console.log(id);
            this.tipoPagoService.getTipoPago(id).subscribe(
                response=>{
                    this.tipo_pago=response;
                },
                error=>{
                    console.log(<any>error);
                    let text="Error de conexion";
                    this.toaste.errorAlerta(text,'Error!');
                }
            );
        });
    }
    onSubmit(){
        this.route.params.forEach((params:Params)=>{
            let id=params['id'];
            this.tipoPagoService.updateTipoPago(id,this.tipo_pago).subscribe(
                result=>{
                    this.router.navigate(['/'+this.user.rol+'/tipo_pago']);
                    this.alertaUpdate();
                },
                error=>{
                    console.log(<any>error);
                    let text="El Nombre dela tipo Pago existe";
                    this.toaste.WarningAlert(text,'Error!');
                }
            );
        });
    }
    onCancel(){
        this.router.navigate(['/'+this.user.rol+'/tipo_pago']);
        this.alertaCancel();
    }
    list(){
        this.onCancel();
    }
    //------------------------------------------------------------------------------------
    tabla(){
        // this.getProveedores();
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
        );
    }
    
    edit(id){
        this.router.navigate(['/'+this.user.rol+'/tipo_pago/edit',id]);
      //  this.alertaSelect();
    }
    alertaCancel(){
        swal({
            position: 'center',
            icon: "error",
            title: 'Cancelado',
            buttons: false,
            timer: 3000,
          })   
    }
    alertaUpdate(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Actualizado',
            buttons: false,
            timer: 3000
          })   
    }
}