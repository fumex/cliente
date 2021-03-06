import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { AuthService } from '../../auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { User } from '../../auth/interfaces/user.model';
import { ClienteModel } from '../models/cliente';
import { DocumentoService } from '../../TipoDocumento/services/documento.service';
import { PermisosRolesModel } from '../../usuarios/modelos/permisos_roles';
import { environment } from '../../../environments/environment';
import { UsuarioService } from '../../usuarios/services/usuarios.service';

declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'cliente-add',
    templateUrl:'../views/cliente-add.html',
    providers:[ClienteService, ToastService]
})
export class ClienteAddComponent implements OnInit{
    
    public title:string;
    public tipo:string;
    public tipo_cliente:string;
    public cliente:ClienteModel;
    public clientes:any=[];
    public user:User;
    public documentos:any=[];
    public estado:boolean;
    public confirmado:boolean;
    public url;
    public veradd=null;
    public veredit=null;
    public verdelete=null;
    public mandar:PermisosRolesModel;
    constructor(
        private clienteService:ClienteService,
        private auth:AuthService,
        private route:ActivatedRoute,
        private router:Router,
        private toaste:ToastService,
        private toastr:ToastsManager,
        private documentoService:DocumentoService,
        vcr:ViewContainerRef,
        private _UsuarioService:UsuarioService,
    ){
        this.title="Agregar Cliente";
        this.url=environment.url+'admin/cliente';
        this.user=this.auth.getUser();
        this.mandar = new PermisosRolesModel(this.user.id,null,this.url,null,null);
        let i=0;
        this._UsuarioService.getpermisos(this.mandar).subscribe(
            res=>{
                console.log(res)
                if(res.mensaje==true){
                    console.log("entro");
                    this.veradd=true;
                    this.veredit=true;
                    this.verdelete=true;
                    this.user=auth.getUser();
                        this.estado=true;
                        this.confirmado=true;
                        this.title='Agregar Cliente';
                        this.tipo='Nombre';
                        this.tipo_cliente='Nombre de Cliente';
                        this.toastr.setRootViewContainerRef(vcr);
                        this.cliente= new ClienteModel(null,'',null,'','','','','',this.user.id);
                        this.tabla();
                }else{
                    if(res.mensaje!=false){
                        while(i<res.length){
                            if(res[i].tipo_permiso=="insercion" && res[i].estado==true){
                                this.veradd=true;
                            }
                            if(res[i].tipo_permiso=="edicion" && res[i].estado==true){
                                this.veredit=true;
                            }
                            if(res[i].tipo_permiso=="anulacion" && res[i].estado==true){
                                this.verdelete=true;
                            }
                            i++
                        }
                        this.user=auth.getUser();
                        this.estado=true;
                        this.confirmado=true;
                        this.title='Agregar Cliente';
                        this.tipo='Nombre';
                        this.tipo_cliente='Nombre de Cliente';
                        this.toastr.setRootViewContainerRef(vcr);
                        this.cliente= new ClienteModel(null,'',null,'','','','','',this.user.id);
                        this.tabla();
                    }else{
                        this.router.navigate(['/'+this.user.rol]);
                    }
                }
                console.log(this.veradd);
            },
            err=>{
                console.log(<any>err);
            }
        )
        
    }
    ngOnInit(){
        this.getDocumentos();
        this.getClientes();
    }
    opcion1(){
        this.tipo='Razon Social';
        this.tipo_cliente='Razon Social Cliente';
    }
    opcion2(){
        this.tipo='Nombre';
        this.tipo_cliente='Nombre Cliente';
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
    onDeleteCliente(id){
        this.clienteService.deleteCliente(id).subscribe(
            result=>{
                console.log(result);
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        );
    }
    onSubmit(){
        this.clienteService.addCliente(this.cliente).subscribe(
            result=>{
                console.log(result);
                this.clearCliente();
                this.destruir();
                this.alertSave();
            },
            error=>{
                console.log(<any>error);
                let text="El DNI del cliente ya existe";
                this.toaste.WarningAlert(text,'Error!');
            }
        );
    }
    clearCliente(){
        this.cliente= new ClienteModel(null,'',null,'','','','','',this.user.id);
    }
    onCancel(){
        this.clearCliente();
    }
    edit(id){
        this.router.navigate(['/'+this.user.rol+'/cliente/edit',id]);
        this.alertaUpdate();
    }
    //--------------------Alert--------------------------
    alertSave(){
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
                this.onDeleteCliente(identi);
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
    exit(){
        this.estado=true;
    }
    //-------------------------------------------------------------------
    destruir(){	
        var table = $('#cli').DataTable(); table .clear() ;
        $('#cli').DataTable().destroy();
        this.reconstruir();
    }
    reconstruir(){
        this.tabla();
        this.getClientes();
    }
    tabla(){
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