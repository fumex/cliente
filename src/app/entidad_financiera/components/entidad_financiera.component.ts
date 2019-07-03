import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { EntidadFinancieraService } from '../services/entidad_financiera.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { EntidadFinancieraModel } from '../models/entidad_financiera';
import { User } from '../../auth/interfaces/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ToastsManager } from 'ng2-toastr';
import { PermisosRolesModel } from '../../usuarios/modelos/permisos_roles';
import { environment } from '../../../environments/environment';
import { UsuarioService } from '../../usuarios/services/usuarios.service';

declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'tipoPago-add',
    templateUrl:'../views/entidadFinanciera.html',
    providers:[EntidadFinancieraService,ToastService]
})
export class EntidadFinancieraComponent implements OnInit{
    public title;
    public user:User;
    public entidades:Array<EntidadFinancieraModel>=[];
    public entidadedit:EntidadFinancieraModel;
    public entidadesadd:EntidadFinancieraModel;
    public veredit=null;
    public url2;
    public mandar:PermisosRolesModel;
    constructor(
        private _EntidadFinancieraService:EntidadFinancieraService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        private _UsuarioService:UsuarioService,
        vcr:ViewContainerRef 
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.title='Entidad Financiera';
        this.url2=environment.url+'admin/EntidadFinaciera';
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
        this.entidadesadd=new EntidadFinancieraModel(null,null,this.user.id,null);
        this.entidadedit=new EntidadFinancieraModel(null,null,this.user.id,null);
        this.tabla();
    }
    ngOnInit(){
        this.getentidades();
    }
    getentidades(){
        this._EntidadFinancieraService.entidades().subscribe(
            res=>{
                console.log(res);
                this.entidades=res;
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    guardarentidad(){
        console.log(this.entidadesadd);
        this._EntidadFinancieraService.addentidad(this.entidadesadd).subscribe(
            res=>{
                console.log(res);
                if(res.code==200){
                    this.limpiar();
                    this.destruir();
                    this.reconstruir();
                    this.alertaSave();
                }else{
                    if(res.code==300){
                        this.toaste.errorAlerta('Error!!!',"ya existe ese codigo sunat")
                    }
                }
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    cancelar(){
        this.veredit=null;
        this.entidadedit=new EntidadFinancieraModel(null,null,this.user.id,null);
    }
    editarentidad(id){
        this.limpiar();
        this.veredit=id;
        this.getentidad(id);
    }
    getentidad(id){
        this._EntidadFinancieraService.getentidad(id).subscribe(
            res=>{
                this.entidadedit=res;
                console.log(res);
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    updateentidad(){
        this._EntidadFinancieraService.updateentidad(this.entidadedit.id,this.entidadedit).subscribe(
            res=>{
                console.log(res);
                if(res.code==200){
                    this.cancelar();
                    this.destruir();
                    this.reconstruir();
                    this.alertaUpdate();
                }else{
                    if(res.code==300){
                        this.toaste.errorAlerta('Error!!!',"ya existe ese codigo sunat")
                    }
                }
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    deleteentidad(id){
        this._EntidadFinancieraService.eliminar(id).subscribe(
            res=>{
                this.destruir();
                this.reconstruir();
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    limpiar(){
        this.entidadesadd=new EntidadFinancieraModel(null,null,this.user.id,null);
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
            title: 'Actualizado...',
            buttons: false,
            timer: 2000,
        })   
    }
    alertaDelete(id){
        swal({
            title: "esta seguro",
            text: "despúes de borrar, no se pude recuperar",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.deleteentidad(id);
                swal({
                    position: 'center',
                    icon: "error",
                    title: 'eliminado...',   
                    timer: 3000,
                    buttons: false,
                });
            }
          });
    }
    
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#entidafinaciera').DataTable({
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ]
                 });
            });
        },3000);
    }
   
    destruir(){	
        var table = $('#entidafinaciera').DataTable(); table .clear() ;
        $('#entidafinaciera').DataTable().destroy();
    }
    reconstruir(){
        this.tabla();
        this.getentidades();
    }
}