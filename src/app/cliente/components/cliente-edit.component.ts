import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { AuthService } from '../../auth/services/auth.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { User } from '../../auth/interfaces/user.model';
import { ClienteModel } from '../models/cliente';
import { DocumentoService } from '../../TipoDocumento/services/documento.service';

declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'cliente-edit',
    templateUrl:'../views/cliente-add.html',
    providers:[ClienteService, ToastService]
})
export class ClienteEditComponent implements OnInit{
    
    public title:string;
    public cliente:ClienteModel;
    public clientes:any=[];
    public user:User;
    public documentos:any=[];
    public estado:boolean;
    constructor(
        private documentoService:DocumentoService,
        private clienteService:ClienteService,
        private auth:AuthService,
        private route:ActivatedRoute,
        private router:Router,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef
    ){
        this.user=this.auth.getUser();
        this.title='Editar Cliente'
        this.toastr.setRootViewContainerRef(vcr);
        this.tabla();
        this.cliente= new ClienteModel(null,'','',null,'','','','',this.user.id);
    }
    ngOnInit(){
        this.getCliente();
        this.getClientes();
        this.getDocumentos();
    }
    getDocumentos(){
        this.documentoService.getDocumPersona().subscribe(
            result=>{
                this.documentos=result;
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        );
    }
    getClientes(){
        this.clienteService.getClientes().subscribe(
            result=>{
                this.clientes=result;
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        );
    }
    getCliente(){
        this.route.params.forEach((params:Params)=>{
            let id=params['id'];
            console.log(id);
            this.clienteService.getCliente(id).subscribe(
                result=>{
                    this.cliente = result;
                    console.log(this.cliente);
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
            this.clienteService.updateCliente(id,this.cliente).subscribe(
                result=>{
                    this.onCancel();
                    this.alertUpdate();
                },
                error=>{
                    console.log(<any>error);
                    let text="El DNI del cliente ya existe";
                    this.toaste.WarningAlert(text,'Error!');
                }
            );
        });
    }
    //-------------------------------------------------------------
    onCancel(){
        this.router.navigate(['/'+this.user.rol+'/cliente']);
        this.alertaCancel();
    }
    edit(id){
        this.router.navigate(['/'+this.user.rol+'/cliente/edit',id]);
      //  this.alertaSelect();
    }
    //----------------------------Alertas---------------------------------------
    alertUpdate(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Actualizado',
            buttons: false,
            timer: 3000
          })   
    }
    alertaSelect(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Cargando...',
            buttons: false,
            timer: 3000
          })   
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
    //----------------------------tabla-----------------------------------------
    tabla(){
        // this.getProveedores();
         setTimeout(function(){
             
             $(function(){
                  $('#cli').DataTable({
                      dom: 'Bfrtip',
                      buttons: [
                          'copy', 'csv', 'excel', 'pdf', 'print'
                      ]
                  });
             });
         },3000);
    }
}