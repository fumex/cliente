import { Component, OnInit } from '@angular/core';
import { ServicioPagoService } from '../services/servicio.service';
import { ServicioAnularModel } from '../models/servicio-anular';
import { ActivatedRoute, Router } from '@angular/router';

declare  var $:any;
@Component({
    selector:'servicio-anular',
    templateUrl:'../views/servicio-anular.html',
    providers:[ServicioPagoService]
})
export class ServicioAnularComponent implements OnInit{

    public title:string;
    public servicio:ServicioAnularModel;
    public servicios:ServicioAnularModel[];
    public code:string;
    public id:number
    public documento:string;
    public nroBoleta:string;
    public tipo_pago:string;
    public nombre_proveedor:string;
    public descripcion:string;
    public subtotal:number;
    public igv:number;
    public fecha:string
    constructor(
        private anularService:ServicioPagoService,
        private route:ActivatedRoute,
        private router:Router
    ){
        this.title='ANULAR SERVICIO';
        this.tabla();
    }
    ngOnInit(){
        this.getServicios();
    }
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#mytable').DataTable();
            });
        },3000);
     }
     getServicios(){
        this.anularService.listServicios().subscribe(
            result=>{
                this.servicios=result;
                console.log(this.servicios);
            },
            error=>{
                console.log(<any>error);
            }
        );
     }
     getServicio(id,cod,documen,nroBoleta,tipo_pago,nombre_proveedor,descripcion,subtotal,igv,created_at){
         this.servicio= new ServicioAnularModel(id,cod,documen,nroBoleta,
                                                tipo_pago,nombre_proveedor,descripcion,
                                                subtotal,igv,created_at);
         this.asignarCampos(this.servicio);
     }

     asignarCampos(servi:ServicioAnularModel){
        this.id=servi.id;
        this.code=servi.code;
        this.documento=servi.documento;
        this.nroBoleta=servi.nroBoleta;
        this.tipo_pago=servi.tipo_pago;
        this.nombre_proveedor=servi.nombre_proveedor;
        this.descripcion=servi.descripcion;
        this.subtotal=servi.subtotal;
        this.igv=servi.igv;
        this.fecha=servi.created_at;
     }
     anular(){
         this.anularService.deleteServicio(this.id).subscribe(
            result=>{
                console.log(result);
                this.router.navigate(['/admin/transaccion/list']);
            },
            error=>{
                console.log(<any>error);
            }         
        );
     }

}