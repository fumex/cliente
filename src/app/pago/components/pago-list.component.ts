import { Component, OnInit,  ViewContainerRef } from '@angular/core';
import { PagoService } from '../services/pago.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { PagoAnulaModel } from '../models/pago-anular';
import { ProveedorService } from '../../proveedor/services/proveedor.service';
import { environment } from '../../../environments/environment';
import { PermisosRolesModel } from '../../usuarios/modelos/permisos_roles';
import { UsuarioService } from '../../usuarios/services/usuarios.service';

declare var jQuery:any;
declare var $:any;
@Component({
    selector:'pago-list',
    templateUrl:'../views/pago-list.html',
    providers:[PagoService, ToastService]
})
export class PagoListComponent implements OnInit{

    public pagoDetalle:any=[];
    //-------------------------------
    public title:string;
    public pagos:any=[];
    public provee:any;
    public confirmado;
    public user:User;
    public cadena;
    public pago:PagoAnulaModel;
    public url;
    public mandar:PermisosRolesModel;
    public veragregar=null;
    constructor(
        private pagoService:PagoService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef,
        private _UsuarioService:UsuarioService,
    ){
        this.url=environment.url+'admin/transaccion/list';
        this.user=this.auth.getUser();
        this.mandar = new PermisosRolesModel(this.user.id,null,this.url,null,null);
        let i=0; 
        this._UsuarioService.getpermisos(this.mandar).subscribe(
            res=>{
                console.log(res)
                
                if(res.mensaje!=false){
                    this.mandar.url=environment.url+'admin/transaccion';
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
                }else{
                    
                    this.router.navigate(['/'+this.user.rol]);
                }
                console.log(this.veragregar);
            },
            err=>{
                console.log(<any>err);
            }
        )
        this.toastr.setRootViewContainerRef(vcr);
        this.user=this.auth.getUser();
        this.title='Lista de Compras';
        this.tabla();

    }
    ngOnInit(){
        this.getPagos();
    }
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#pago').DataTable({
                    
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ]
                 });
            });
        },5000);
    }
    getPagos(){
         this.pagoService.listPago(this.user.id).subscribe(
             result=>{
                this.pagos=result;
             },
             error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
             }
         );
    }
    agregar(){
        this.router.navigate(['/'+this.user.rol+'/transaccion']);
    }

    recibo(id,code,id_prove,nom_prove,docume,nroBoleta,almacen,tipoPago,subtotal,igv,exonerado,gravado,otro,fecha){
        let pago= new PagoAnulaModel(id,code,id_prove,nom_prove,docume,nroBoleta,almacen,tipoPago,subtotal,igv,exonerado,gravado,otro,fecha);   
        if(!this.pagoService.getPagoP()){
            this.pagoService.setPago(pago);
            this.router.navigate(['/'+this.user.rol+'/transaccion/recibo']);
        }
        else{
            let a =this.pagoService.clear();
            this.pagoService.setPago(pago);
            this.router.navigate(['/'+this.user.rol+'/transaccion/recibo']);
        }
    }
}