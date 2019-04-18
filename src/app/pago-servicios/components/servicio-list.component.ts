import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ServicioPagoService } from '../services/servicio.service';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { PermisosRolesModel } from '../../usuarios/modelos/permisos_roles';
import { UsuarioService } from '../../usuarios/services/usuarios.service';
import { environment } from '../../../environments/environment';

declare var jQuery:any;
declare var $:any;
@Component({
    selector:'servicio-list',
    templateUrl:'../views/servicio-list.html',
    providers:[ServicioPagoService, ToastService]

})
export class ServicioListComponent implements OnInit{
    public title:string;
    public servicios:any[];
    public user:User;
    public url;
    public mandar:PermisosRolesModel;
    public veragregar=null;
    constructor(
        private servicioPago:ServicioPagoService,
        private auth:AuthService,
        private route:ActivatedRoute,
        private router:Router,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef,
        private _UsuarioService:UsuarioService,
    ){
        this.url=environment.url+'admin/servicio/list'; 
        this.user=this.auth.getUser();
        this.mandar = new PermisosRolesModel(this.user.id,null,this.url,null,null);
        let i=0; 
        this._UsuarioService.getpermisos(this.mandar).subscribe(
            res=>{
                console.log(res)
                
                if(res.mensaje!=false){
                    this.mandar.url=environment.url+'admin/servicio';
                    this._UsuarioService.getpermisos(this.mandar).subscribe(
                        result=>{
                            if(result.mensaje!=false){
                                this.veragregar=true;
                            }
                        },
                        err=>{
                            console.log(<any>err);
                        }
                    )
                    this.toastr.setRootViewContainerRef(vcr);
                    this.user=this.auth.getUser();
                    this.title='LISTA SERVICIOS';
                    this.tabla();
                }else{
                    
                    this.router.navigate(['/'+this.user.rol]);
                }
            },
            err=>{
                console.log(<any>err);
            }
        )
        
    }
    ngOnInit(){
       this.listServicios();
    }
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#example').DataTable({
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ],
                 });
            });
        },3000);
     }
     listServicios(){
        this.servicioPago.listServicios().subscribe(
            result=>{
                this.servicios=result;
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        );
     }
     agregar(){
         this.router.navigate(['/'+this.user.rol+'/servicio']);
     }
}