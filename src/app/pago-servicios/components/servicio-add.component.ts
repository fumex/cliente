import { Component, OnInit } from '@angular/core';
import { ServicioPagoService } from '../services/servicio.service';
import { ServicioModel } from '../models/servicio';
import { DocumentoModel } from '../../TipoDocumento/models/documento';
import { ServicioAddModel } from '../models/servicio-add';
import { ActivatedRoute, Router } from '@angular/router';

declare  var $:any;
@Component({
    selector:'servicio-add',
    templateUrl:'../views/servicio-add.html',
    providers:[ServicioPagoService]

})
export class ServicioAddComponent implements OnInit{
    
    public title:string;
    public code:string;
    public servicios:ServicioModel[];
    public servicio:ServicioModel;
    public servicioPago:ServicioAddModel;
    public comprobantes:DocumentoModel[];
    public nombre:string;
    public ruc:string;
    public direccion:string;
    public tipo:string;
    public total:number;
    public igv:number;
    public compo:string;
    public id_proveedor:number;
    constructor(
        private serviPagoService:ServicioPagoService,
        private route:ActivatedRoute,
        private router:Router
    ){
        this.title='SERVICIOS'
        this.tabla();
        this.total=null;
        this.igv=null;
    }
    ngOnInit(){
        this.getCodigo();
        this.getServicio();
        this.getDocumento();
    }
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#mytable').DataTable();
            });
        },3000);
     }
     //--------------Codigo-------------------------
     getCodigo(){
         this.serviPagoService.getCode().subscribe(
             result=>{
                this.code=result;
             },
             error=>{
                 console.log(<any>error);
             }
         );
     }
     //---------------Servicio----------------------
     getServicio(){
         this.serviPagoService.getServicio().subscribe(
            result=>{
                this.servicios=result;
                console.log(this.servicios);
            },
            error=>{
                console.log(<any>error);
            }
         );
     }
     //------------------Documentos---------------------
     getDocumento(){
         this.serviPagoService.getDocumento().subscribe(
             result=>{
                this.comprobantes=result;
                console.log(this.comprobantes);
             },
             error=>{
                 console.log(<any>error);
             }
         );
     }
     //---------------Agregar Servicio----------------
     addServicio(id,nombre_proveedor,ruc,direccion,tipo){
        this.servicio = new ServicioModel(id,nombre_proveedor,ruc,direccion,'','',tipo);
        console.log(this.servicio);
        this.asignarCompos(this.servicio)
     }
     asignarCompos(servi:ServicioModel){
        this.id_proveedor=servi.id;
        this.nombre=servi.nombre_proveedor;
        this.ruc=servi.ruc;
        this.direccion=servi.direccion;
        this.tipo=servi.tipo;
     }
     sumaTotal(subtotal){
         this.igv=parseFloat(subtotal)*0.18;
         this.total=parseFloat(subtotal) + this.igv;
     }
     //---------------Guardar-----------------------------------
     onSubmit(compro, nroRecibo, tipoP, descrip, subtotal){
        this.servicioPago=new ServicioAddModel(null,this.code,compro,nroRecibo,tipoP,this.id_proveedor,descrip,subtotal,this.igv);
        this.serviPagoService.addServicio(this.servicioPago).subscribe(
            result=>{
                console.log(result);
                this.router.navigate(['/admin/servicio/list']);
            },
            error=>{
                console.log(<any>error)
            }
        )
     }

}