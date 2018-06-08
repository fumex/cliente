import { Component, OnInit } from '@angular/core';
import { PagoService } from '../services/pago.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompraAnularModel } from '../models/anula-compra';
import { PagoDetalleModel } from '../models/pago-detalle';
import { PagoModel } from '../models/pago';
import { PagoAnulaModel } from '../models/pago-anular';

declare  var $:any;
@Component({
    selector:'pago-anular',
    templateUrl:'../views/pago-anular.html',
    providers:[PagoService]
})
export class PagoAnularComponent implements OnInit{
    public title:string;
    public code:string;
    public compras:CompraAnularModel[];
    public pagos:PagoAnulaModel[];
    public pago:PagoAnulaModel;
    public id_compra:number;

    //-------------------------------------------
    public nombre_proveedor:string;
    public documento:string;
    public nroBoleta:string;
    public almacen:string;
    public tipoPago:string;
    public subtotal:number;
    public igv:number;
    public fecha:string;

    constructor(
        private pagoService:PagoService,
        private route:ActivatedRoute,
        private router:Router
    ){
        this.title="ANULAR COMPRA";
        this.code="";
        this.tabla();
    }
    ngOnInit(){
        this.listaPagos();
    }
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#mytable').DataTable();
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
            }
        );
    }
    anularCompra(){
        this.pagoService.getCompra(this.code).subscribe(
            result=>{
                this.id_compra=result;
                console.log(this.id_compra);
                this.anularComp(this.id_compra);
                this.router.navigate(['/admin/transaccion/list']);
            }, 
            error=>{
                console.log(<any>error);
            }
        );
    }
    anularComp(id){
        this.pagoService.anularPago(id).subscribe(
            result=>{
                console.log(result);
                this.anularPagoDetalle();
            },
            error=>{
                console.log(<any>error);
            }
        )
    }
    anularPagoDetalle(){
       let compra_service=this.pagoService;
        this.compras.forEach(function(value){
            compra_service.anularPagoDetalle(value.id).subscribe(
                result=>{
                    console.log(result);
                },
                error=>{
                    console.log()
                }
            );                 
        });
    }

    listaPagos(){
        this.pagoService.listPago().subscribe(
            result=>{
                this.pagos=result;
                console.log(this.pagos)
            },
            error=>{
                console.log(<any>error)
            }
        );
    }
    getPago(id,code,nom_prove,docume,nroBoleta,almacen,tipoPago,subtotal,igv,fecha){
        this.pago = new PagoAnulaModel(id,code,nom_prove,docume,nroBoleta,almacen,tipoPago,subtotal,igv,fecha);
        this.asignarCampos(this.pago);
        this.listDetalle(this.code);
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
        this.fecha=pago.created_at;
    }

    
}