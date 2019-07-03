import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ProveedorService } from '../services/proveedor.service'; 
import { ProveedorModel } from '../models/proveedor';
import { TipoProveedorService } from '../services/tipoProveedor.service';
import { TipoProveedorModel } from '../models/tipoProveedor';
import { Router, ActivatedRoute,Params } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/interfaces/user.model';
import { ToastService } from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { environment } from "../../../environments/environment";
import { PermisosRolesModel } from "../../usuarios/modelos/permisos_roles";
import { UsuarioService } from "../../usuarios/services/usuarios.service";

declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'proveedor-add',
    templateUrl:'../views/proveedor-add.html',
    providers:[ProveedorService, ToastService]

})
export class ProveedorAddComponent implements OnInit{
    public title:string;
    public estado:boolean;
    public proveedor:ProveedorModel;
    public tipos:TipoProveedorModel[];
    public tipo:TipoProveedorModel;
    public user:User;
    public proveedores:any=[];
    public confirmado:boolean;
    public url;
    public veradd=null;
    public veredit=null;
    public verdelete=null;
    public mandar:PermisosRolesModel;
    constructor(
        private proveedorService:ProveedorService,
        private tipoProveedor:TipoProveedorService,
        private auth:AuthService,
        private _UsuarioService:UsuarioService,
        private  route:ActivatedRoute,
        private router:Router,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.user=auth.getUser();
        this.proveedor= new ProveedorModel(null,'','','','','','',null,this.user.id);
        this.estado=true;
        this.tipo = new TipoProveedorModel(null,null,null);
        this.title="Proveedor"
        this.confirmado=true;
        
        this.url=environment.url+'admin/Proveedor';
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
                        this.tabla(); 
                    }else{
                        this.router.navigate(['/'+this.user.rol]);
                    }
                }
               
            },
            err=>{
                console.log(<any>err);
            }
        )
    }
    ngOnInit(){
            
        this.getTipo();
        this.getProveedores(); 
    }

    getAdd(){
        this.estado=false;
    }
    getExit(){
        this.estado=true;
        this.getTipo();
    }
    
    onSubmit(){
        this.proveedorService.addProveedor(this.proveedor).subscribe(
            response=>{
                console.log(response);
                this.clearProveedor();
                this.destruir();
                this.alertaSave();
            },
            error=>{
                console.log(<any>error);
                let text="El Proveedor o Ruc ya existe";
                this.toaste.WarningAlert(text,'Error!');
            }
        );
    }
    getTipo(){
        this.tipoProveedor.getTipo().subscribe(
            result=>{
                this.tipos=result;
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        );
    }
    saveTipo(tipo1:string,operacion:string){
        this.tipo = new TipoProveedorModel(tipo1, operacion,this.user.id);
        console.log(this.tipo);
        this.tipoProveedor.addTipo(this.tipo).subscribe(
            response=>{
                console.log(response);
                this.exit();
                this.getTipo();
            },
            error=>{
                console.log(<any>error);
                let text="El Tipo de proveedor ya existe";
                this.toaste.WarningAlert(text,'Error!');
            }
        );
    }
    exit(){
        this.estado=true;
    }
    onCancel(){
        this.clearProveedor();
    }
    clearProveedor(){
        this.proveedor= new ProveedorModel(null,'','','','','','',null,this.user.id);
    }
    //----------------------Lista--------------------------------------
    tabla(){
        // this.getProveedores();
         setTimeout(function(){
             
             $(function(){
                  $('#provee').DataTable({
                      dom: 'Bfrtip',
                      buttons: [
                          'copy', 'csv', 'excel', 'pdf', 'print'
                      ]
                  });
             });
         },3000);
    }

    getProveedores(){
        this.proveedorService.getTable().subscribe(
            result=>{
                this.proveedores=result;
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        );
    }
    onDeleteProveedor(id){
        this.proveedorService.deleteProveedor(id).subscribe(
            result=>{
               //this.getProveedores();
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        )
    }
    
    edit(id){
        this.router.navigate(['/'+this.user.rol+'/proveedor/edit',id]);
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
                this.onDeleteProveedor(identi);
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
        var table = $('#provee').DataTable(); table .clear() ;
        $('#provee').DataTable().destroy();
        this.reconstruir();
    }
    reconstruir(){
        this.tabla();
        this.getProveedores();
    }
}