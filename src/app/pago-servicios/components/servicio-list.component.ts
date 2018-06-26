import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ServicioPagoService } from '../services/servicio.service';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

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
    constructor(
        private servicioPago:ServicioPagoService,
        private auth:AuthService,
        private route:ActivatedRoute,
        private router:Router,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.user=this.auth.getUser();
        this.title='LISTA SERVICIOS';
        this.tabla();
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