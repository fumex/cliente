import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ServicioPagoService } from '../services/servicio.service';
import { ServicioModel } from '../models/servicio';
import { DocumentoModel } from '../../TipoDocumento/models/documento';
import { ServicioAddModel } from '../models/servicio-add';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


declare  var $:any;
declare var swal:any;
@Component({
    selector:'servicio-add',
    templateUrl:'../views/servicio-add.html',
    providers:[ServicioPagoService, ToastService]

})
export class ServicioAddComponent implements OnInit{
    
    public title:string;
    public code:string;
    public servicios:ServicioModel[];
    public servicio:ServicioModel;
    public servicioPago:ServicioAddModel;
    public comprobantes:DocumentoModel[];
    public nombre:string;
    public ruc:string;
    public direccion:string;
    public tipo:string;
    public total:number;
    public igv:number;
    public compo:string;
    public id_proveedor:number;
    public user:User;

    public a1:boolean;
    public a2:boolean;
    public a3:boolean;
    public a4:boolean;
    public a5:boolean;
    public validacion:boolean;
    public val:boolean;
    public a6:boolean;  

    public confirmado;
    constructor(
        private serviPagoService:ServicioPagoService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.title='SERVICIOS'
        this.user=this.auth.getUser();
        this.tabla();
        this.total=null;
        this.igv=null;
        this.confirmado=false;
        this.a1=false;
        this.a2=false;
        this.a3=false;
        this.a4=false;
        this.a5=false;
        this.validacion=false;
        this.val=false;
        this.a6=false

    }
    ngOnInit(){
        this.getCodigo();
        this.getServicio();
        this.getDocumento();
    }
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#serviadd').DataTable();
            });
        },3000);
     }
     //--------------Codigo-------------------------
     getCodigo(){
         this.serviPagoService.getCode().subscribe(
             result=>{
                this.code=result;
             },
             error=>{
                 console.log(<any>error);
             }
         );
     }
     //---------------Servicio----------------------
     getServicio(){
         this.serviPagoService.getServicio().subscribe(
            result=>{
                this.servicios=result;
                console.log(this.servicios);
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
         );
     }
     //------------------Documentos---------------------
     getDocumento(){
         this.serviPagoService.getDocumento().subscribe(
             result=>{
                this.comprobantes=result;
                console.log(this.comprobantes);
             },
             error=>{
                 console.log(<any>error);
                 let text="Error de conexion";
                 this.toaste.errorAlerta(text,'Error!');
             }
         );
     }
     //---------------Agregar Servicio----------------
     addServicio(id,nombre_proveedor,ruc,direccion,tipo){
        this.servicio = new ServicioModel(id,nombre_proveedor,ruc,direccion,'','',tipo);
        console.log(this.servicio);
        this.confirmado=id;
        this.asignarCompos(this.servicio)
     }
     asignarCompos(servi:ServicioModel){
        this.id_proveedor=servi.id;
        this.nombre=servi.nombre_proveedor;
        this.ruc=servi.ruc;
        this.direccion=servi.direccion;
        this.tipo=servi.tipo;
        this.a6=true;
        this.validar();
     }
     sumaTotal(subtotal){
         let sub= parseFloat(subtotal);
         this.igv=parseFloat((sub*0.18).toFixed(2));
         this.total=parseFloat((sub+ this.igv).toFixed(2));
         this.validate5(sub);
     }
     //---------------Guardar-----------------------------------
     onSubmit(compro, nroRecibo, tipoP, descrip, subtotal){
        this.servicioPago=new ServicioAddModel(null,this.code,compro,nroRecibo,tipoP,this.id_proveedor,descrip,subtotal,this.igv,this.user.id);
        this.serviPagoService.addServicio(this.servicioPago).subscribe(
            result=>{
                console.log(result);
                this.list();
                this.alertaSave();
            },
            error=>{
                console.log(<any>error);
                let text="el comprobante ya existe";
                this.toaste.WarningAlert(text,'Error!');
            }
        )
     }
     list(){
        this.router.navigate(['/'+this.user.rol+'/servicio/list']);
    }

    //--------------Validacion---------------------------------------
    validate1(){
        this.a1=true;
        this.validar();
    }
    validate2(recibo){
        if(recibo ===""){
            this.a2=false;
            this.validar();
        }else{
            this.a2=true;
            this.validar();
        }
    }
    validate3(){
        this.a3=true;
        this.validar();
    }
    validate4(descrp){
        if(descrp==""){
            console.log('aqui');
            this.a4=false;
            this.validar();
        }else{
            this.a4=true;
            this.validar();
        }
        
    }
    validate5(total){
        if(total==""){
            this.a5=false;
            this.validar();
        }else{
            this.a5=true;
            this.validar();
        } 
    }
    validar(){
        if(this.a1==true && this.a2==true && this.a3==true){
            this.validacion=true;
            if(this.a4==true && this.a5==true && this.a6==true){
                this.val=true;
            }else{
                this.val=false;
            }
        }else{
            this.validacion=false;
        }
    }
    alertaSave(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Guardado...',
            buttons: false,
            timer: 4000,
        })   
    }

}