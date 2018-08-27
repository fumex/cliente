import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { MonedaService } from '../services/moneda.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { MonedaModel } from '../models/moneda';
import { User } from '../../auth/interfaces/user.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ToastsManager } from 'ng2-toastr';

declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'moneda-edit',
    templateUrl:'../views/moneda-add.html',
    providers:[MonedaService, ToastService]
})
export class MonedaEditComponent implements OnInit{
    
    public title;
    public moneda:MonedaModel;
    public user:User;
    public confirmado:boolean;
    public monedas:MonedaModel[];
    constructor(
        private monedaService:MonedaService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.user=auth.getUser();
        this.title='Editar Documento'
        this.moneda= new MonedaModel(null,'',null,this.user.id,null,null);
        this.confirmado=false;
        this.tabla();
    }
    ngOnInit(){
        this.getMoneda();
        this.getMonedas();
    }
    getMoneda(){
        this.route.params.forEach((params:Params)=>{
            let id=params['id'];
            console.log(id);
            this.monedaService.getMoneda(id).subscribe(
                response=>{
                    this.moneda=response;
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
            this.monedaService.updateMoneda(id,this.moneda).subscribe(
                result=>{
                    this.router.navigate(['/'+this.user.rol+'/moneda']);
                    this.alertaUpdate();
                },
                error=>{
                    console.log(<any>error);
                    let text="El Nombre dela moneda existe";
                    this.toaste.WarningAlert(text,'Error!');
                }
            );
        });
    }
    onCancel(){
        this.router.navigate(['/'+this.user.rol+'/moneda']);
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
                  $('#docu').DataTable({
                      dom: 'Bfrtip',
                      buttons: [
                          'copy', 'csv', 'excel', 'pdf', 'print'
                      ]
                  });
             });
         },3000);
    }
    getMonedas(){
        this.monedaService.getMonedas().subscribe(
            result=>{
                this.monedas=result;
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        );
    }
    
    edit(id){
        this.router.navigate(['/'+this.user.rol+'/moneda/edit',id]);
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