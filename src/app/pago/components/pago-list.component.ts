import { Component, OnInit,  ViewContainerRef } from '@angular/core';
import { PagoService } from '../services/pago.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

declare var jQuery:any;
declare var $:any;
@Component({
    selector:'pago-list',
    templateUrl:'../views/pago-list.html',
    providers:[PagoService, ToastService]
})
export class PagoListComponent implements OnInit{

    public title:string;
    public pagos:any=[];
    public confirmado;
    public user:User;
    constructor(
        private pagoService:PagoService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef
    ){
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
}