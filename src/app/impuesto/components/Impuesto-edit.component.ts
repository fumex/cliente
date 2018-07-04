import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastService } from '../../toastalert/service/toasts.service';
import { ImpuestoService } from '../services/impuesto.service';
import { ImpuestoModel } from '../models/impuesto';
import { User } from '../../auth/interfaces/user.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ToastsManager } from 'ng2-toastr';

declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'impuesto-edit',
    templateUrl:'../views/impuesto-add.html',
    providers:[ImpuestoService,ToastService]

})
export class ImpuestoEditComponent implements OnInit{
    public title;
    public impuesto:ImpuestoModel;
    public user:User;
    public confirmado:boolean;
    public impuestos:ImpuestoModel[];
    constructor(
        private impuestoService:ImpuestoService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.user=auth.getUser();
        this.title='Editar Impuesto'
        this.impuesto= new ImpuestoModel(null,'',null,'','',this.user.id);
        this.confirmado=false;
        this.tabla();
    }
    ngOnInit(){
        this.getImpuesto();
        this.getImpuestos();
    }

    getImpuesto(){
        this.route.params.forEach((params:Params)=>{
            let id=params['id'];
            console.log(id);
            this.impuestoService.getImpuesto(id).subscribe(
                response=>{
                    this.impuesto=response;
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
            this.impuestoService.updateImpuesto(id,this.impuesto).subscribe(
                result=>{
                    this.router.navigate(['/'+this.user.rol+'/impuesto']);
                    this.alertaUpdate();
                },
                error=>{
                    console.log(<any>error);
                    let text="El Nombre del Impuesto existe";
                    this.toaste.WarningAlert(text,'Error!');
                }
            );
        });
    }
    onCancel(){
        this.router.navigate(['/'+this.user.rol+'/impuesto']);
        this.alertaCancel();
    }
    list(){
        this.onCancel();
    }
    //------------------------------------------------------------------------------------
    tabla(){
         setTimeout(function(){
             
             $(function(){
                  $('#impu').DataTable({
                      dom: 'Bfrtip',
                      buttons: [
                          'copy', 'csv', 'excel', 'pdf', 'print'
                      ]
                  });
             });
         },3000);
    }
    getImpuestos(){
        this.impuestoService.getImpuestos().subscribe(
            result=>{
                this.impuestos=result;
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        );
    }
    
    edit(id){
        this.router.navigate(['/'+this.user.rol+'/impuesto/edit',id]);
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