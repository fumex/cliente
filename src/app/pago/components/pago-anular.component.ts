import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { PagoService } from '../services/pago.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompraAnularModel } from '../models/anula-compra';
import { PagoDetalleModel } from '../models/pago-detalle';
import { PagoModel } from '../models/pago';
import { PagoAnulaModel } from '../models/pago-anular';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

declare  var $:any;
declare var swal:any;
@Component({
    selector:'pago-anular',
    templateUrl:'../views/pago-anular.html',
    providers:[PagoService,ToastService]
})
export class PagoAnularComponent implements OnInit{
    public title:string;
    public code:string;
    public compras:CompraAnularModel[];
    public pagos:PagoAnulaModel[];
    public pago:PagoAnulaModel;
    public id_compra:number;
    public detallepagosid:Array<any>=[];
    //-------------------------------------------
    public nombre_proveedor:string;
    public documento:string;
    public nroBoleta:string;
    public almacen:string;
    public tipoPago:string;
    public subtotal:number;
    public igv:number;
    public exonerados:number;
    public gravados:number;
    public otro:number;
    public fecha:string;
    //------------------------------------------------
    public user:User;
    public confirmado;
    public val:boolean;
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
        this.user=auth.getUser();
        this.title="ANULAR COMPRA";
        this.code="";
        this.user
        this.tabla();
        this.confirmado=null;
        this.val=false;
    }
    ngOnInit(){
        this.listaPagos();
    }
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#pagoanu').DataTable();
            });
        },3000);
     }
    listDetalle(cod){
        this.code=cod;
        this.pagoService.listDetallePago(cod).subscribe(
            result=>{
                console.log(result);
                this.compras=result;
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        );
    }
    anularCompra(){
        this.pagoService.getCompra(this.code).subscribe(
            result=>{
                this.id_compra=result;
                console.log(this.id_compra);
                this.anularComp(this.id_compra);
                this.getdetalle(this.code)
            }, 
            error=>{
                console.log(<any>error);
            }
        );
    }
    getdetalle(cod){
        this.pagoService.getdetallepagoanulacion(cod).subscribe(
            res=>{
                this.detallepagosid=res;
                console.log(this.detallepagosid);
                this.anularPagoDetalle();
            },
            err=>{
                console.log(<any>err);
            }
        )
    }
    anularComp(id){
        this.pagoService.anularPago(id).subscribe(
            result=>{
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }
        )
    }
    anularPagoDetalle(){
        let i=0;
        console.log(this.detallepagosid.length);
        while(i<this.detallepagosid.length){
            console.log(this.detallepagosid[i].id);
            this.anulard_pago(this.detallepagosid[i].id);
            this.insertarainventarioymovimientos(this.detallepagosid[i].id);

            i++;
        }
        //this.list();
        /*let compra_service=this.pagoService;
        this.compras.forEach(function(value){
            compra_service.anularPagoDetalle(value.id).subscribe(
               
            );                 
        });*/
    }
    anulard_pago(id){
        console.log(id)
        this.pagoService.anularPagoDetalle(id).subscribe(
            result=>{
                console.log(result);
            },
            error=>{
                console.log()
            }
        );
    }
    insertarainventarioymovimientos(id){
        console.log(id)
        this.pagoService.ingresarIyManulacion(id).subscribe(
            result=>{
                console.log(result);
                    
            },
            error=>{
                console.log()
            }
        );
        this.pagoService.borrardealmacen(id).subscribe(
            result=>{
                console.log(result);
            },
            error=>{
                console.log()
            }
        );  
       
    }
    listaPagos(){
        this.pagoService.listPago(this.user.id).subscribe(
            result=>{
                this.pagos=result;
                console.log(this.pagos)
            },
            error=>{
                console.log(<any>error)
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        );
    }
    getPago(id,code,nom_prove,docume,nroBoleta,almacen,tipoPago,subtotal,igv,exonerado,gravados,otro,fecha){
        this.pago = new PagoAnulaModel(id,code,null,nom_prove,docume,nroBoleta,almacen,tipoPago,subtotal,igv,exonerado,gravados,otro,fecha);
        this.asignarCampos(this.pago);
        this.listDetalle(this.code);
        this.confirmado=id;
        this.val=true;
    }

    asignarCampos(pago:PagoAnulaModel){
        this.code=pago.code;
        this.nombre_proveedor=pago.nombre_proveedor;
        this.documento=pago.documento;
        this.nroBoleta=pago.nroBoleta;
        this.almacen=pago.almacen;
        this.tipoPago=pago.tipoPago;
        this.subtotal=pago.subtotal;
        this.igv=pago.igv;
        this.exonerados=pago.exonerados;
        this.gravados=pago.gravados;
        this.otro=pago.otro;
        this.fecha=pago.fecha;
    }
    list(){
        this.router.navigate(['/'+this.user.rol+'/transaccion/list']);
    }
    //Alerta 
    alertaDelete(){
        swal({
            title: "Esta seguro",
            text: "despúes de borrar, no se pude recuperar",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.anularCompra();
                swal({
                    position: 'center',
                    icon: "error",
                    title: 'eliminado...',   
                    timer: 6000,
                    buttons: false,
                });
            } else {
              
            }
          });
    }
}
