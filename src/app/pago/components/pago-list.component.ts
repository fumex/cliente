import { Component, OnInit,  ViewContainerRef } from '@angular/core';
import { PagoService } from '../services/pago.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { PagoAnulaModel } from '../models/pago-anular';
import { ProveedorService } from '../../proveedor/services/proveedor.service';

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