import { Component,ViewContainerRef } from "@angular/core";
import { CajasModels } from "../../cajas/modelos/cajas";
import { DetalleCajasUsuarioService } from '../../cajas/services/detalle.cajas.usuarios.services';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';
import {SucursalService} from '../../sucursales/services/sucursal.service';
import {DettaleUsuarioService} from '../../usuarios/services/DetalleUsuario.service';
import {SucursalModel} from '../../sucursales/modelos/sucursal';
import {UsuarioModel} from '../../usuarios/modelos/usuarios';
import {ToastService} from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {DetalleCaja} from '../modelos/detalle_cajas';
import {DetalleVentasModel} from '../../ventas/modelos/detalle_ventas';
import {DetalleVentasService} from '../services/DetalleVentas.service';
import {VentasService} from '../services/Ventas.service';
import { VentasModel } from '../modelos/ventas';
import {AnularDetalleModel} from '../modelos/anular_detalle';
import {EmpresaService} from '../../empresa/services/empresa.service';
import {EmpresaModel} from '../../empresa/models/empresa';
import{AnularModel} from '../modelos/anular'
import {AnularService} from '../services/notadecredito.service';

import { ImpuestoService } from "../../impuesto/services/impuesto.service";

import { environment } from '../../../environments/environment';
import{conversordenumerosaletras} from '../services/numeroaletras.service';
import { isNumber } from "util";
import { nullSafeIsEquivalent } from "@angular/compiler/src/output/output_ast";

declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
    selector:'nota-credito',
    templateUrl:'../views/ventas_anular.html',
    providers:[ToastService,SucursalService,DetalleVentasService,AnularService,ImpuestoService,conversordenumerosaletras,VentasService,EmpresaService]
})
export class AnularVentaComponent{
    public id_venta=null;
    public cambiarcolor=null;
    public user:any;
    public titulo;
    public sucursales:any;
    public ventas:VentasModel;
    public d_ventas:Array<any>=[];                                  
    public d_ventasvarante:Array<any>=[];
    public ventasfinal:Array<any>=[];
    public impuestos:Array<any>=[];
    public impuestosventas:Array<any>=[];
    public subtotalventas=0;
    public totalventas=0;
    public tiponotas=new Array();
    public detalleventas:DetalleVentasModel;
    public getventa:any;
    public anular:AnularModel;
    public modal;
    public modaldetalles;
    public modalemail;
    public modal_d_global;
    public modalventa;
    public verventas=null;
    public nombretiponota=null;
    public vertodaslasventas=false;
    public textserie=null;
    public textnumero=null;
    public textmotivo=null;
    public textvalidar=null;
    public textglobal;
    public combotipos=null;
    public cargando=null;
    public getimpuestos:Array<any>=[];
    public verresumenfinal=null;
    public vercorreccion=null;
    public verdescuentogloval=null;
    public veritems=null;
    public verdetalleventas=null;
    public tipoventa=null;
    public seriedenota=null;
    public letrado=null;
    public subtotal=null;
    public vernuevoruc=null;
    public total=null;
    public tipodeitem=null;
    public anulardetalle:AnularDetalleModel;
    public anular_detalle:Array<AnularDetalleModel>=[];
    public detalletenporal:DetalleVentasModel;
    public siguiente=null;
    public validarnumero=null;
    public editardetalleanular=null;
    public arregloparaelfinal:Array<any>=[];
    public contenido=null;
    public contenidoOriginal=null;
    public total04=0;
    public fecha=null;
    public empresa:EmpresaModel;
    public totalventa=0;
    public validarglobal=false;
    public url;
    imageUrl: string = "assets/images/1.png";
    constructor(
        private _SucursalService:SucursalService,
        private _AnularService:AnularService,
        private _DettaleUsuarioService:DettaleUsuarioService,
        public _DetalleCajasUsuarioService:DetalleCajasUsuarioService,
        private _DetalleVentasService:DetalleVentasService,
        private conversor:conversordenumerosaletras,
        private auth:AuthService,
        private router:Router,
        private _ImpuestoService:ImpuestoService,
        private _VentasService:VentasService,
        private toaste:ToastService,
        private _EmpresaService:EmpresaService,
        public toastr: ToastsManager,
        vcr: ViewContainerRef
        
    ){
        this.titulo="Notas de Credito"
        this.toastr.setRootViewContainerRef(vcr);
        //this.tablaventas();
        this.user=this.auth.getUser();
        this.url=environment.api_url; 
        this.imageUrl=this.url+'/imagenes/2.png';
        this.textserie=document.getElementById('textserie');
        this.textnumero=document.getElementById('textnumero');
        this.textmotivo=document.getElementById('textmotivo');
        this.combotipos=document.getElementById('combotipo');
        this.textglobal=document.getElementById('textdesglobal');
    }
    ngOnInit(){
        
        this.tiponotas[0]=['Anulacion de la Operacion','01'];
        this.tiponotas[1]=['Anulacion por error en el RUC','02'];
        this.tiponotas[2]=['Correccion por error en la descripcion','03'];
        this.tiponotas[3]=['Descuento Gloval','04'];
        this.tiponotas[4]=['Descuento por Item','05'];
        this.tiponotas[5]=['Devolución total','06'];
        this.tiponotas[6]=['Devolucion por Item','07'];
        this.getimp();
        this.textserie=document.getElementById('textserie');
        this.textnumero=document.getElementById('textnumero');
        this.textmotivo=document.getElementById('textmotivo');
        this.combotipos=document.getElementById('combotipo');
        this.textglobal=document.getElementById('textdesglobal');
        var f=new Date();
        let mes=f.getMonth()*1+1;
        this.fecha=f.getDate()+'/'+mes+'/'+f.getFullYear();
        this.anular=new AnularModel(null,null,null,null,null,null,null,this.user.id,null,null,null,null,null,0,0,this.fecha);
        this.getventa=new VentasModel(null,null,null,null,null,null,null,null,null,null,this.user.id,null,null,null,null,0,null,null,null,null,null,null,null);
        this.anulardetalle=new AnularDetalleModel(null,null,null,null,null,null,null,null,null,0);
        this.detalletenporal=new DetalleVentasModel(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null)
        this.ventas=new VentasModel(null,null,null,null,null,null,null,null,null,null,this.user.id,null,null,null,null,0,null,null,null,null,null,null,null);
        this.empresa=new EmpresaModel(null,null,null,null,null,null,null,null,null,null,null,null,null)
        this.getempresa();
        this.modal=document.getElementById('myModal');
        this.modaldetalles=document.getElementById('modaldetalles');
        this.modalemail=document.getElementById('modalemail');
        this.modal_d_global=document.getElementById('modaldescuentoglobal');
        this.modalventa=document.getElementById('modalventa');
        window.onclick = function(event) {
            if (event.target == this.document.getElementById('myModal') ) {
                this.document.getElementById('myModal').style.display = "none";
            }
        }

        window.onclick = function(event) {
            if (event.target == this.document.getElementById('modalemail')) {
                this.document.getElementById('modalemail').style.display = "none";
            }
        }

        window.onclick = function(event) {
            if (event.target == this.document.getElementById('modaldescuentoglobal')) {
                this.document.getElementById('modaldescuentoglobal').style.display = "none";
            }
        }
        
        window.onclick = function(event) {
            
            if (event.target == this.document.getElementById('modalventa')) {
                this.document.getElementById('modalventa').style.display = "none";
                
            }
        }

        window.onclick = function(event) {
            if (event.target == this.document.getElementById('modaldetalles') ) {
                this.document.getElementById('modaldetalles').style.display = "none";
            }
        }
    }
    getempresa(){
        this._EmpresaService.dataEmpresa().subscribe(
            res=>{
                this.empresa=res;
                console.log(this.empresa);
                this.imageUrl=this.url+'/empresa-img/'+this.empresa.imagen;
            },
            err=>{
                console.log(<any>err);
            }
        )
    }
    getimp(){
        this._ImpuestoService.getImpuestos().subscribe(
            res=>{
                this.getimpuestos=res;
                console.log(this.getimpuestos)
            },
            err=>{
                console.log(<any>err)
            }
        )
    }
    getserie(letra){
        let i=0,j=0;
        let n_serie=0;
        let numero=null;
        let array=null;
        this._AnularService.getserieanular(letra).subscribe(
            res=>{
                console.log(res);
                
                if(res.cantidad>0){
                    array=res.ultimo.split('-');
                }else{
                    array=[letra+'001',0]
                }
                n_serie=parseInt(array[0]);

                if(parseInt(array[1])==99999999){
                    this.seriedenota=letra;
                    console.log(this.seriedenota);
                    numero=parseInt(res.ultimo.charAt(1)+res.ultimo.charAt(2)+res.ultimo.charAt(3))+1;
                    while(j<3-numero.toString().length){
                        console.log(this.seriedenota);
                        this.seriedenota+="0"
                        j++
                    }
                    this.seriedenota+=numero+"-000001";
                }else{
                    this.seriedenota=array[0];
                    this.seriedenota +="-";
                    /*while(i<6-(parseInt(array[1])+1).toString().length){
                        this.seriedenota+="0";
                        i++;
                    }*/
                    this.seriedenota+=parseInt(array[1])+1;
                   
                }
                console.log(this.seriedenota);

                this.anular.serie_nota=this.seriedenota;
                this.anular.letrado=this.letrado;
                this.anular.subtotal=this.subtotal;
                this.anular.total=this.total;
                this._AnularService.guardarnotas(this.anular).subscribe(
                    res=>{
                        console.log(res);
                        if(res.code==200){
                            if(this.anular_detalle.length){
                                console.log(this.anular_detalle.length);
                                this.guardardetallenotacredito();
                            }else{
                                //this.alertaecho();
                            }
        
                        }
                        
                    },
                    err=>{
                        console.log(<any>err);
                    }
                );
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    calcularcantidaddescuntoitem(){
        /*var numero=this.anulardetalle.cantidad.toString();
        let cant=numero.charAt(0);*/
        this.textvalidar=document.getElementById('txtval');
        let numeroigv=0,i=0,validado=null,numeromaximo=0;
        console.log(this.textvalidar.value);
        

        console.log(this.anulardetalle.cantidad_total*(this.detalletenporal.igv_porcentage/100));
        numeroigv=this.anulardetalle.cantidad_total*(18/100)
        numeromaximo=(this.detalletenporal.precio_unitario*((100-this.detalletenporal.descuento)/100)*1+this.detalletenporal.isc*1+this.detalletenporal.otro*1)*this.detalletenporal.cantidad;
        console.log(numeromaximo);
        if(this.anulardetalle.cantidad_total>numeromaximo){
            this.toaste.WarningAlert('La cantidad de descuento excedió el importe del item','Alerta!!!!!!')
            this.anulardetalle.cantidad_total=Math.round(numeromaximo*100)/100;
            this.textvalidar.focus();
        }
        
        if(this.anular.serie.charAt(0)=="F"){
            if(numeroigv==0){
                console.log('invalñdo')
                this.validarnumero=false;
                this.anulardetalle.igv=0;
                this.anulardetalle.isc=0;
                this.anulardetalle.otro=0;
                this.anulardetalle.cantidad=0;  
                this.anulardetalle.cantidad_sinigv=0;
                /*this.textvalidar.focus();
                this.textvalidar.select();*/
            }else{
                console.log('validao')
                this.anulardetalle.cantidad=this.anulardetalle.cantidad_total*1/(1+(this.detalletenporal.isc_porcentage*1+this.detalletenporal.otro_porcentage*1)/100);
                this.anulardetalle.igv=Math.round(this.anulardetalle.cantidad*100)/100;
                while(i<this.getimpuestos.length){
                    if(this.detalletenporal.igv_id==this.getimpuestos[i].id){
                        if(this.getimpuestos[i].nombre.toUpperCase()=="GRAVADOS"){
                            this.anulardetalle.cantidad_sinigv=Math.round(this.anulardetalle.cantidad/(1+(this.detalletenporal.igv_porcentage*1/100))*100)/100;
                            this.anulardetalle.igv=Math.round((this.anulardetalle.cantidad/(1+(this.detalletenporal.igv_porcentage*1/100)))*(this.detalletenporal.igv_porcentage/100)*100)/100;
                            validado=i;
                        }
                    }
                    i++
                }
                this.validarnumero=true;
                
                this.anulardetalle.isc=Math.round(this.anulardetalle.cantidad*(this.detalletenporal.isc_porcentage/100)*100)/100;
                this.anulardetalle.otro=Math.round(this.anulardetalle.cantidad*(this.detalletenporal.otro_porcentage/100)*100)/100;

                /*if(validado!=null){
                    this.anulardetalle.cantidad_total=Math.round((this.anulardetalle.cantidad_sinigv*1+this.anulardetalle.igv*1+this.anulardetalle.isc*1+this.anulardetalle.otro*1)*100)/100; 
                }else{
                    this.anulardetalle.cantidad_total=Math.round((this.anulardetalle.igv*1+this.anulardetalle.isc*1+this.anulardetalle.otro*1)*100)/100; 
                }*/
                
            }
        }else{
            if(this.anulardetalle.cantidad>0){
                this.validarnumero=true;
            }
        }
       
    }
    guardarnotasinemail(){
        this.anular.email=null;
        this.gurardarnotacredito();
    }
    gurardarnotacredito(){
        console.log(this.anular);
        this.anular.letrado=this.letrado;
        if(this.anular.tipo_nota=="02"){
            this._VentasService.obtenerdocumentos().subscribe(
                res=>{
                    console.log(res);
                    if(this.anular.serie.charAt(0)=="B"){
                        this.anular.serie_venta_remplazo=res.b;
                    }else{
                        this.anular.serie_venta_remplazo=res.f;
                    }
                    console.log(this.anular);
                },
                err=>{

                }
            );
        }
        this.getserie(this.anular.serie.charAt(0));
        console.log(this.anular);
       
    }
    guardardetallenotacredito(){
        let i=0,validart=null,arreglo:AnularDetalleModel;
        while(i<this.anular_detalle.length){
            console.log(this.anular_detalle[i]);
            arreglo=this.anular_detalle[i];
            this._AnularService.guardardetallenotas(this.anular_detalle[i]).subscribe(
                res=>{
                    console.log(res);
                    console.log(arreglo);
                    if(res.code==200){
                        if(this.anular.tipo_nota=="01" || this.anular.tipo_nota=="06" || this.anular.tipo_nota=="07"){
                            this.completardetallenotas(arreglo);
                        }
                    }
                },
                err=>{
                    console.log(<any>err);
                    validart=1;
                }
            );
            i++
            if(validart==null && i==this.anular_detalle.length){
                console.log(i+" entro "+this.anular_detalle.length)
                this.alertaecho();
               
                //this.limpiartodo();
                
            }
        }
        
    }
    
    completardetallenotas(array:AnularDetalleModel){
        this._AnularService.guardarmoveinvendencredito(array).subscribe(
            res=>{
                console.log(res);
            },
            err=>{
                console.log(<any>err);
            }
        );
        this._AnularService.anulaciondeventa(array).subscribe(
            res=>{
                console.log(res);
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    limpiarimpuestos(){
        while(0<this.impuestos.length){
            this.impuestos.splice(0,1);
        }
    }
    limpiardetalleanular(){
        while(0<this.anular_detalle.length){
            this.anular_detalle.splice(0,1);
        }
    }
    limpiartodo(){
        this.total04=0;
        this.cargando=null;
        this.limpiarventas();
        this.limpiarimpuestos();
        this.limpiardetalleanular();
        this.limpiardventasvar();
        this.veritems=null;
        this.vernuevoruc=null;
        this.textmotivo.disabled=false;
        this.textnumero.disabled=false;
        this.textserie.disabled=false;
        this.combotipos.disabled=false;
        this.verresumenfinal=null;
        this.total=0;
        this.subtotal=0
        this.anular=new AnularModel(null,null,null,null,null,null,null,this.user.id,null,null,null,null,null,0,0,this.fecha);
    }
    volveratras(){
        let i=0,j=0;
        console.log(this.d_ventas);
        this.verresumenfinal=null;
        this.total=0;
        this.subtotal=0;
        this.total04=0;
        this.limpiarimpuestos();
        this.limpiardventasvar();
        if(this.anular.tipo_nota=="01" || this.anular.tipo_nota=="02" || this.anular.tipo_nota=="04" || this.anular.tipo_nota=="06"){
            this.veritems=null;
            this.textmotivo.disabled=false;
            this.textnumero.disabled=false;
            this.textserie.disabled=false;
            this.combotipos.disabled=false;
            this.anular.tipo_nota=null;
            this.limpiardetalleanular();
            

        }else{
            while(i<this.d_ventas.length){
                while(j<this.anular_detalle.length){
                    if(this.anular_detalle[j].id_detalle_venta==this.d_ventas[i].id){
                        this.d_ventas[i].precio_unitario=parseFloat(this.d_ventas[i].pago_tarjeta);
                        this.d_ventas[i].cantidad=this.d_ventas[i].pago_efectivo;
                        this.d_ventas[i].nombre_producto=this.d_ventas[i].observaciones;
                    }
                    j++
                }
                j=0;
                i++
            }
            
        }
       
        console.log(this.verresumenfinal);
    }
    limpiardventasvar(){
        while(0<this.d_ventasvarante.length){
            this.d_ventasvarante.splice(0,1);
        }
    }
    cancelar(){
        this.veritems=null;
        this.cargando=null;
        this.textserie.disabled = false;
        this.textnumero.disabled = false;
        this.textmotivo.disabled=false;
        this.combotipos.disabled=false;
        this.anular=new AnularModel(null,null,null,null,null,null,null,this.user.id,null,null,null,null,null,0,0,this.fecha);
    }
    
    finalizar04(){
        let i=0;
        this.cerrarmodaldglobal();
        console.log(this.anulardetalle);
        this.verresumenfinal=1;
        this.d_ventasvarante.push({
            cantidad:0,
            nombre_producto:this.anular.motivo,
            descuento:0,
            precio_unitario:Math.round(this.anulardetalle.cantidad*100)/100,
        })
        this.subtotal=this.anulardetalle.cantidad_sinigv;
        this.total=this.anulardetalle.cantidad_total;
        
        while(i<this.impuestos.length){
            if(this.impuestos[i].tipo.toUpperCase()=="IGV"){
                this.anulardetalle.igv+=parseFloat(this.impuestos[i].cantidad);
            }
            if(this.impuestos[i].tipo.toUpperCase()=="ISC"){
                this.anulardetalle.isc+=parseFloat(this.impuestos[i].cantidad);
            }
            if(this.impuestos[i].tipo.toUpperCase()=="OTRO"){
                this.anulardetalle.otro+=parseFloat(this.impuestos[i].cantidad);
            }
            i++;
        } 
        this.anulardetalle.id_detalle_venta=0;
        this.anular_detalle.push(this.anulardetalle);
        console.log(this.anular_detalle);
        this.anulardetalle=new AnularDetalleModel(null,null,null,null,null,null,null,null,null,0);
        this.letrado=this.conversor.NumeroALetras(this.anular_detalle[0].cantidad_total);
    }
    finalizar3y5y7(){
        this.verresumenfinal=1;
        let i=0,j=0;
        while(i<this.anular_detalle.length){
            while(j<this.d_ventas.length){
                console.log(this.d_ventas[j])
                console.log(this.anular_detalle[i]);
                if(this.anular_detalle[i].id_detalle_venta==this.d_ventas[j].id){
                    console.log('entro');
                    if(this.anular.tipo_nota=="03"){
                        this.d_ventas[j].pago_efectivo=this.d_ventas[j].cantidad;
                        this.d_ventas[j].pago_tarjeta=this.d_ventas[j].precio_unitario;
                        this.d_ventas[j].cantidad=0; 
                        this.d_ventas[j].observaciones=this.d_ventas[j].nombre_producto;
                        this.d_ventas[j].nombre_producto="DICE : "+ this.d_ventas[j].nombre_producto+" DEBE DECIR : "+this.anular_detalle[i].correccion;
                    }
                    if(this.anular.tipo_nota=="05"){
                        this.d_ventas[j].pago_tarjeta=this.d_ventas[j].precio_unitario;
                        this.d_ventas[j].observaciones=this.d_ventas[j].nombre_producto;
                        this.d_ventas[j].pago_efectivo=this.d_ventas[j].cantidad;
                        this.d_ventas[j].precio_unitario=this.anular_detalle[i].cantidad;
                    }
                    this.d_ventasvarante.push(this.d_ventas[j]);
                  
                }
                j++
            }
            j=0;
            i++
        }
        console.log(this.d_ventas)
        this.notafinal(this.d_ventasvarante);
    }
    adddevolucion(array){
        this.detalletenporal=array;
        array.id_venta=null;
        this.anulardetalle.id_detalle_venta=array.id
        this.anulardetalle.cantidad=array.precio_unitario*((100-array.descuento)/100);
        this.anulardetalle.igv=array.igv;
        this.anulardetalle.isc=array.isc;
        this.anulardetalle.otro=array.otro;
        this.anular_detalle.push(this.anulardetalle);
        this.anulardetalle=new AnularDetalleModel(null,null,null,null,null,null,null,null,null,0);
    }
    quitardevolvucion(array){
        let i=0,j=0;
        while(i<this.anular_detalle.length){
            if(this.anular_detalle[i].id_detalle_venta==array.id){
                this.anular_detalle.splice(i,1);
            }
            i++
        }
        array.id_venta=this.id_venta;
        console.log(this.anular_detalle);

    }
    adddetallenota(){
        let i=0;
        while(i<this.anular_detalle.length){
            if(this.detalletenporal.id==this.anular_detalle[i].id_detalle_venta){
                this.anular_detalle.splice(i,1);
            }
            i++
        }
        i=0;
        this.anulardetalle.id_detalle_venta=this.detalletenporal.id;
        while(i<this.d_ventas.length){
            if(this.d_ventas[i].id==this.detalletenporal.id){
                this.d_ventas[i].id_venta=null;
            }
            i++;
        }
        this.anular_detalle.push(this.anulardetalle);
        this.cerrarmodaldetalles();
        console.log(this.d_ventas);
        console.log(this.anular_detalle);

    }
    quitardetallenota(){
        let i=0,j=0;
        while(i<this.anular_detalle.length){
            if(this.detalletenporal.id==this.anular_detalle[i].id_detalle_venta){
                this.anular_detalle.splice(i,1);
            }
            i++
        } 
        i=0;
        while(j<this.d_ventas.length){
            console.log(this.d_ventas[j].id)
            if(this.detalletenporal.id==this.d_ventas[j].id){
                this.d_ventas[j].id_venta=this.id_venta;
            }
            j++
        }
        this.anulardetalle=new AnularDetalleModel(null,null,null,null,null,null,null,null,null,0);
        this.modaldetalles.style.display = "none";
        console.log(this.d_ventas);
        console.log(this.anular_detalle);
    }
    abrirmodalemail(){
        this.modalemail.style.display = "block";
    }
    abrirmodalglobal(){
        this.modal_d_global.style.display = "block";
    }
    abrirmodalventa(){
        this.totalventa=0;
        this.subtotalventas=0;
        while(0<this.impuestosventas.length){
            this.impuestosventas.splice(0,1);
        }
        let i=0,j=0,k=0,validar=null,nombreigv;
        this.modalventa.style.display = "block";
        //this.detalletenporal=this.d_ventas;
        while(i<this.d_ventas.length){
            while(j<this.getimpuestos.length){
                if(this.d_ventas[i].igv_id==this.getimpuestos[j].id){
                    if(this.getimpuestos[j].nombre.toUpperCase()=="GRAVADOS"){
                        this.subtotalventas=this.subtotalventas*1+(this.d_ventas[i].precio_unitario*((100-this.d_ventas[i].descuento)/100)*1-this.d_ventas[i].igv*1)*this.d_ventas[i].cantidad;
                        nombreigv="IGV";
                    }else{
                        nombreigv=this.getimpuestos[j].nombre;
                    }
                    while(k<this.impuestosventas.length){
                        if(this.d_ventas[i].igv_id==this.impuestosventas[k].id){
                            validar=k;
                            this.impuestosventas[k].cantidad=this.impuestosventas[k].cantidad*1+this.d_ventas[i].igv*this.d_ventas[i].cantidad;
                        }
                        k++;
                    }
                    if(validar==null){
                        this.impuestosventas.push({
                            id:this.d_ventas[i].igv_id,
                            nombre:nombreigv,
                            cantidad:this.d_ventas[i].igv*this.d_ventas[i].cantidad,
                            porcentage:this.d_ventas[i].igv_porcentage,
                            tipo:this.getimpuestos[j].tipo
                        })
                    }
                }
                if(this.d_ventas[i].isc_id==this.getimpuestos[j].id){
                    while(k<this.impuestosventas.length){
                        if(this.getimpuestos[j].id==this.impuestosventas[k].id){
                            validar=k;
                            this.impuestosventas[k].cantidad=this.impuestosventas[k].cantidad*1+this.d_ventas[i].isc*this.d_ventas[i].cantidad;
                        }
                        k++;
                    }
                    if(validar==null){
                        this.impuestosventas.push({
                            id:this.d_ventas[i].isc_id,
                            nombre:this.getimpuestos[j].nombre,
                            cantidad:this.d_ventas[i].isc*this.d_ventas[i].cantidad,
                            porcentage:this.d_ventas[i].isc_porcentage,
                            tipo:this.getimpuestos[j].tipo
                        })
                    }
                }
                if(this.d_ventas[i].otro_id==this.getimpuestos[j].id){
                    while(k<this.impuestosventas.length){
                        if(this.getimpuestos[j].id==this.impuestosventas[k].id){
                            validar=k;
                            this.impuestosventas[k].cantidad=this.impuestosventas[k].cantidad*1+this.d_ventas[i].otro*this.d_ventas[i].cantidad;
                        }
                        k++;
                    }
                    if(validar==null){
                        this.impuestosventas.push({
                            id:this.d_ventas[i].otro_id,
                            nombre:this.getimpuestos[j].nombre,
                            cantidad:this.d_ventas[i].otro*this.d_ventas[i].cantidad,
                            porcentage:this.d_ventas[i].otro_porcentage,
                            tipo:this.getimpuestos[j].tipo
                        })
                    }
                }
                validar=null;
                k=0;
                j++;
            }
            validar=null;
            k=0;
            j=0
            i++;
        }
        this.totalventa=this.subtotalventas*1;
        while(k<this.impuestosventas.length){
            this.totalventa=this.totalventa*1+this.impuestosventas[k].cantidad*1
            k++
        }
        this.letrado=this.conversor.NumeroALetras(this.totalventa);
        console.log(this.impuestosventas)
        console.log(this.totalventa+'-'+this.subtotalventas)
    }
    cerrarmodalemail(){
        this.anular.email=null;
        this.modalemail.style.display = "none";
    }
    cerramodalventa(){
        //this.anular=new AnularModel(null,null,null,null,null,null,null,this.user.id,null,null,null,null,null,0,0,this.fecha);
        this.modalventa.style.display = "none";
        
    }
    cerrarmodaldglobal(){
        this.anular.descuento=null;
        this.modal_d_global.style.display = "none";
    }
    vermodaldglobal(){
        this.modaldetalles.style.display = "block";
    }
    vermodaldetallenota(array){
        
        this.editardetalleanular=null;
        this.anulardetalle=new AnularDetalleModel(null,null,null,null,null,null,null,null,null,0);
        console.log(array)
        this.modaldetalles.style.display = "block";
        this.detalletenporal=array;
        console.log(this.getventa);
    }
    verdetalleagregado(array){
        this.editardetalleanular=1;
        let i=0;
        this.modaldetalles.style.display = "block";
        this.detalletenporal=array;
        while(i<this.anular_detalle.length){
            if(array.id==this.anular_detalle[i].id_detalle_venta){
                this.anulardetalle=this.anular_detalle[i];
            }
            i++;
        }
    }
    
    limitarserie(){
        this.limpiarventas();
        this.anular.id_venta=null;
        this.cargando=null;
        this.anular.serie=this.anular.serie.toUpperCase();
        this.textnumero=document.getElementById('textnumero')
        if(this.anular.serie.length==4){
            this.textnumero.focus();
        }
    }
    cambionumero(){
        this.anular.id_venta=null;
        this.cargando=null;
        this.limpiarventas();
        this.textserie=document.getElementById('textserie')
        this.textnumero=document.getElementById('textnumero')
        if(this.textnumero.value.length==0){
            console.log(this.textnumero.value.length)
            this.textserie.focus();
        }
    }

    limpiarventas(){

        while(0<this.d_ventas.length){
            this.d_ventas.splice(0,1);
        }
    }
    verificarserie(botton){
        this.textserie=document.getElementById('textserie');
        this.textnumero=document.getElementById('textnumero');
        this.textmotivo=document.getElementById('textmotivo');
        this.combotipos=document.getElementById('combotipo');
        this.textglobal=document.getElementById('textdesglobal');
        this.limpiardventasvar();
        this.cargando=1;
        let i=0,fechaarreglo:Array<any>=[],mes:Array<any>=[],aceptar=null,dia=0,nrodia=0,diamax=0,lk=0;
        var f=new Date();
        if(this.textserie.value.length<4){
            this.textserie.select();
            this.textserie.focus();
            this.toaste.errorAlerta('La serie del documento deve tener 4 digitos','Error')
            this.cargando=null;
        }else{
            if(this.textnumero.value.length>8){
                this.toaste.errorAlerta('El numero del documento deve tener maximo 8 digitos','Error')
                
                this.textnumero.select();
                this.textnumero.focus();
                this.cargando=null;
                
            }else{
                if(isNaN(parseInt(this.textnumero.value))){
                    this.toaste.errorAlerta('Solo se admiten numeros','Error')
                    this.textnumero.select();
                    this.textnumero.focus();
                    this.cargando=null;
                }else{
                    console.log(this.anular.serie+'-'+this.anular.numero);
                    this._DetalleVentasService.getdetalleventasporserie(this.anular.serie+'-'+this.anular.numero).subscribe(
                        res=>{
                            if(res.result!=false){
                                this.id_venta=res[0].id_venta;
                                this.ventas=res[0];
                                this.d_ventas=res;
                                this.anular.id_venta=res[0].id_venta;
                                this.totalventa=res[0].total;
                                console.log(this.ventas);
                                console.log(this.d_ventas);
                                console.log(this.anular);
                                if(this.anular.serie.charAt(0)=="B"){
                                    this.tipoventa="BOLETA"
                                }else{
                                    this.tipoventa="FACTURA";
                                }
                                if(botton=='ir'){
                                    //this.getserie(this.anular.serie.charAt(0));
                                    if(this.anular.tipo_nota=="02" || this.anular.tipo_nota=="03"){
                                        fechaarreglo=res[0].created_at.split(' ')
                                        console.log(fechaarreglo);
                                        mes=fechaarreglo[0].split('-');
                                        nrodia=f.getDate()%7;
                                        console.log(nrodia)
                                        if(f.getDay()<nrodia){
                                            dia=f.getDay()+7-nrodia;
                                        }else{
                                            dia=f.getDay()-nrodia;
                                        }
                                        console.log(dia)

                                        do{
                                            lk++;
                                            if(dia!=6 && dia!=7){
                                                diamax++
                                            }
                                            if(dia==7){
                                                dia=0;
                                            }
                                            dia++;
                                        }while(lk<f.getDate());
                                        console.log(diamax)
                                        console.log(dia)
                                        console.log(lk)
                                        if(f.getMonth()+1 > parseInt(mes[1])+1 || (f.getMonth()==parseInt(mes[1]) && diamax>15 )){
                                            this.toaste.WarningAlert('las notas de crédito que se realice por error en el RUC o por error en la descripción solo tienen como plazo el décimo quinto (15) día hábil del mes siguiente de emitida la factura electrónica o boleta de venta electrónica objeto de anulación o corrección.','Error')
                                            this.textnumero.select();
                                            this.textnumero.focus();
                                        }else{
                                            aceptar=1;
                                            console.log('its ok');
                                        }
                                    }else{
                                        aceptar=1;
                                    }
                                    if(aceptar!=null){
                                        this.anular.serie_nota=this.seriedenota;
                                        this.nombretiponota=this.tiponotas[parseInt(this.anular.tipo_nota)-1][0];
                                        console.log(this.nombretiponota);
                                        console.log(this.anular);
                                        this.veritems=parseInt(this.anular.tipo_nota);
                                        this.textserie.disabled = true;
                                        this.textnumero.disabled = true;
                                        this.textmotivo.disabled=true;
                                        this.combotipos.disabled=true;
                                        if(this.anular.tipo_nota=="01"  || this.anular.tipo_nota=="06"){
                                            //this.total=res[0].total
                                            while(i<res.length){
                                                this.anulardetalle.cantidad=parseFloat(res[i].precio_unitario);
                                                this.anulardetalle.igv=parseFloat(res[i].igv);
                                                this.anulardetalle.isc=parseFloat(res[i].isc);
                                                this.anulardetalle.otro=parseFloat(res[i].otro);
                                                this.anulardetalle.id_detalle_venta=res[i].id;
                                                this.anular_detalle.push(this.anulardetalle);
                                                this.anulardetalle=new AnularDetalleModel(null,null,null,null,null,null,null,null,null,0);
                                                i++
                                            }
                                            this.d_ventasvarante=res;
                                            this.notafinal(this.d_ventas);
                                           
                                            console.log(this.letrado);
                                            this.verresumenfinal=1;
                                        }
                                        if(this.anular.tipo_nota=="02"){
                                            this.vernuevoruc=1;
                                            this.verresumenfinal=null;
                                            this.veritems=null;
                                            this.d_ventasvarante=res;
                                        }
                                        if(this.anular.tipo_nota=="03"){
                                            this.verresumenfinal=null;
                                            this.tipodeitem="modificara"
                                        };
                                        if(this.anular.tipo_nota=="04"){
                                            let j=0,k=0,validar=null,validar2=null,validar3=null;
                                            while(i<res.length){
                                                this.total04+=res[i].precio_unitario*res[i].cantidad*((100-res[i].descuento)/100)/(1+(res[i].igv_porcentage/100));
                                                i++;
                                            }
                                            console.log(this.total04);
                                            i=0; 
                                            let preciosinigv=0;
                                            while(i<this.d_ventas.length){
                                                preciosinigv=this.d_ventas[i].precio_unitario*this.d_ventas[i].cantidad*((100-this.d_ventas[i].descuento)/100)/(1+(this.d_ventas[i].igv_porcentage/100));
                                                this.d_ventas[i].total=(preciosinigv*100)/this.total04;
                                                while(k<this.impuestos.length){
                                                    if(this.impuestos[k].id==this.d_ventas[i].igv_id || this.impuestos[k].id==this.d_ventas[i].isc_id || this.impuestos[k].id==this.d_ventas[i].otro_id){
                                                        validar=k;
                                                    }
                                                    if( this.impuestos[k].id==this.d_ventas[i].isc_id ){
                                                        validar2=k;
                                                    }
                                                    if( this.impuestos[k].id==this.d_ventas[i].otro_id){
                                                        validar3=k;
                                                    }
                                                    k++
                                                }
                                                k=0;
                                                while(j<this.getimpuestos.length){
                                                    if(validar==null){
                                                        if(this.d_ventas[i].igv_id==this.getimpuestos[j].id){
                                                            if(this.getimpuestos[j].nombre.toUpperCase()=="GRAVADOS"){
                                                                this.impuestos.push({
                                                                    id:this.d_ventas[i].igv_id,
                                                                    nombre:"IGV",
                                                                    cantidad:0,
                                                                    porcentage:this.d_ventas[i].igv_porcentage,
                                                                    tipo:this.getimpuestos[j].tipo
                                                                });
                                                            }else{
                                                                this.impuestos.push({
                                                                    id:this.d_ventas[i].igv_id,
                                                                    nombre:this.getimpuestos[j].nombre,
                                                                    cantidad:0,
                                                                    porcentage:this.d_ventas[i].igv_porcentage,
                                                                    tipo:this.getimpuestos[j].tipo
                                                                });
                                                            }
                                                                
                                                        }
                                                    }
                                                    if(validar2==null){
                                                        if(this.d_ventas[i].isc_id==this.getimpuestos[j].id){
                                                            this.impuestos.push({
                                                            id:this.d_ventas[i].isc_id,
                                                                    nombre:this.getimpuestos[j].nombre,
                                                                cantidad:0,
                                                                porcentage:this.d_ventas[i].isc_porcentage,
                                                                tipo:this.getimpuestos[j].tipo
                                                            });                        
                                                        }
                                                    }
                                                    if(validar3==null){
                                                        if(this.d_ventas[i].otro_id==this.getimpuestos[j].id){
                                                            this.impuestos.push({
                                                                id:this.d_ventas[i].otro_id,
                                                                nombre:this.getimpuestos[j].nombre,
                                                                cantidad:0,
                                                                porcentage:this.d_ventas[i].otro_porcentage,
                                                                tipo:this.getimpuestos[j].tipo
                                                            });                        
                                                        }
                                                    }   
                                                    j++;
                                                }
                                                j=0;
                                                validar=null;
                                                validar2=null;
                                                validar3=null;
                                                i++;
                                            }  
                                            console.log(this.d_ventas); 
                                            console.log(this.impuestos);
                                            console.log(this.ventas);  
                                            this.abrirmodalglobal();
                                            this.veritems=null;
                                        };
                                        if(this.anular.tipo_nota=="05"){
                                            this.verresumenfinal=null;
                                            this.tipodeitem="Descontara"
                                        };
                                        if(this.anular.tipo_nota=="07"){
                                            this.verresumenfinal=null;
                                            this.tipodeitem="Devolvera";
                                        }
                                    }
                                   
                                }
                            }else{
                                this.toaste.errorAlerta('El numero del documento no existe','Error')
                                this.textnumero.select();
                                this.textnumero.focus();
                                this.cargando=null;
                              
                            }
                            
                        },
                        err=>{
                            console.log(<any>err)
                           
                        }
                    );
                }
               
            }
        }
    }
    calcularimpuestos(){
        let i =0,j=0,k=0,porcentage=0,porcentagetotal=0,cantidad=0,cantidad_sinigv=0;
        console.log(this.totalventa)
        this.validarglobal=true;
        if(this.anulardetalle.cantidad_total<0.1){
            this.toaste.WarningAlert('La cantidad de descuento debe ser mayor a 0','Alerta!!!!!!')
            this.validarglobal=false;
            this.textglobal.select();
            this.textglobal.focus();
        }
        if(this.anulardetalle.cantidad_total>this.totalventa){
            this.toaste.WarningAlert('La cantidad de descuento excedió el importe total','Alerta!!!!!!')
            this.anulardetalle.cantidad_total=this.totalventa;
            this.validarglobal=false;
            this.textglobal.focus();
        }

        while(k<this.impuestos.length){
            this.impuestos[k].cantidad=0;
            k++;
        }
        this.anulardetalle.cantidad_sinigv=0;
        while(i<this.d_ventas.length){
            while(j<this.impuestos.length){
                if(this.d_ventas[i].isc_id==this.impuestos[j].id){
                    porcentage=this.d_ventas[i].isc_porcentage*this.d_ventas[i].total/100;
                    porcentagetotal+=this.d_ventas[i].isc_porcentage*this.d_ventas[i].total/100;
                    this.impuestos[j].cantidad+=(this.anulardetalle.cantidad_total/(1+(porcentage)/100))*(porcentage/100);
                    
                }
                if(this.d_ventas[i].otro_id==this.impuestos[j].id){
                    porcentage=this.d_ventas[i].otro_porcentage*this.d_ventas[i].total/100;
                    porcentagetotal+=this.d_ventas[i].otro_porcentage*this.d_ventas[i].total/100;
                    this.impuestos[j].cantidad+=(this.anulardetalle.cantidad_total/(1+(porcentage)/100))*(porcentage/100);
                }
                j++
            }
            j=0;
            i++
        }
        i=0;
        
        cantidad_sinigv=this.anulardetalle.cantidad_total/(1+(porcentagetotal/100));
        this.anulardetalle.cantidad=cantidad_sinigv;
        console.log(cantidad_sinigv);
        while(i<this.d_ventas.length){
            cantidad=cantidad_sinigv*this.d_ventas[i].total/100;
            while(j<this.impuestos.length){
                if(this.d_ventas[i].igv_id==this.impuestos[j].id){
                    if(this.impuestos[j].nombre.toUpperCase()=="IGV"){
                        this.anulardetalle.cantidad_sinigv+=cantidad/(1+(this.d_ventas[i].igv_porcentage)/100);
                        this.impuestos[j].cantidad+=cantidad/(1+(this.d_ventas[i].igv_porcentage)/100)*((this.d_ventas[i].igv_porcentage)/100);
                    }else{
                        this.impuestos[j].cantidad+=cantidad;
                    }
                }
                j++
            }
            j=0;
            i++
        }
    }
    cancelar04(){
        this.total04=0;
        this.cerrarmodaldglobal();
        this.limpiarimpuestos();
        this.anulardetalle=new AnularDetalleModel(null,null,null,null,null,null,null,null,null,0);
        this.textmotivo.disabled=false;
        this.textnumero.disabled=false;
        this.textserie.disabled=false;
        this.combotipos.disabled=false;
    }
    cancelar02(){
        this.limpiartodo();
    }
    finalizar2(){
        if(this.anular.correccion_ruc==this.d_ventas[0].nro_documento){
            this.toaste.errorAlerta('Es el mismo RUC','Error');
        }else{
            let i=0;
            this.vernuevoruc=null;
            while(i<this.d_ventas.length){
                this.anulardetalle.cantidad=parseFloat(this.d_ventas[i].precio_unitario);
                this.anulardetalle.igv=parseFloat(this.d_ventas[i].igv);
                this.anulardetalle.isc=parseFloat(this.d_ventas[i].isc);
                this.anulardetalle.otro=parseFloat(this.d_ventas[i].otro);
                this.anulardetalle.id_detalle_venta=this.d_ventas[i].id;
                this.anular_detalle.push(this.anulardetalle);
                this.anulardetalle=new AnularDetalleModel(null,null,null,null,null,null,null,null,null,0);
                i++ 
            }
            this.notafinal(this.d_ventas);
            this.verresumenfinal=1;
        }
        
    }
    notafinal(res){
        let i=0,j=0,k=0,validar=null,validar2=null;
        if(this.anular.serie.charAt(0)=="B"){
            while(i<res.length){
                this.total+=parseFloat(res[i].precio_unitario)*parseFloat(res[i].cantidad)*(100-parseFloat(res[i].descuento))/100
                i++
            }
        }else{
            while(i<res.length){
                while(j<this.getimpuestos.length){
                    if(res[i].igv_id==this.getimpuestos[j].id){
                        validar=j;
                    }
                    j++;
                }
                j=0;
                
                if(validar!=null){
                    if(this.impuestos.length>0){
                        while(k<this.impuestos.length){
                            if(this.impuestos[k].id==res[i].igv_id){
                                validar2=k;
                            }
                            k++;
                        }
                        k=0
                        if(validar2!=null){
                            this.impuestos[validar2].cantidad+=(res[i].precio_unitario*res[i].cantidad*(100-res[i].descuento)/100)/(1+res[i].igv_porcentage/100)*(res[i].igv_porcentage/100);
                            if(this.impuestos[validar2].nombre=="IGV"){
                                this.subtotal+=(parseFloat(res[i].precio_unitario)*parseFloat(res[i].cantidad)*(100-res[i].descuento)/100)/(1+res[i].igv_porcentage/100);
                                console.log(this.subtotal)
                            }
                        }else{
                            if(this.getimpuestos[validar].nombre.toUpperCase()=="GRAVADOS"){
                                this.subtotal+=(parseFloat(res[i].precio_unitario)*parseFloat(res[i].cantidad)*(100-res[i].descuento)/100)/(1+res[i].igv_porcentage/100);
                                console.log(this.subtotal)
                                this.impuestos.push({
                                    id:res[i].igv_id,
                                    nombre:"IGV",
                                    cantidad:(res[i].precio_unitario*res[i].cantidad*(100-res[i].descuento)/100)/(1+res[i].igv_porcentage/100)*(res[i].igv_porcentage/100),
                                    porcentage:res[i].igv_porcentage
                                });
                            }else{
                                this.impuestos.push({
                                    id:res[i].igv_id,
                                    nombre:this.getimpuestos[validar].nombre,
                                    cantidad:res[i].precio_unitario*(100-res[i].descuento)/100,
                                    porcentage:res[i].igv_porcentage
                                });
                            }
                            
                        }
                    }else{
                        if(this.getimpuestos[validar].nombre.toUpperCase()=="GRAVADOS"){
                            this.subtotal+=(parseFloat(res[i].precio_unitario)*parseFloat(res[i].cantidad)*(100-res[i].descuento)/100)/(1+res[i].igv_porcentage/100);
                            this.impuestos.push({
                                id:res[i].igv_id,
                                nombre:"IGV",
                                cantidad:(res[i].precio_unitario*res[i].cantidad*(100-res[i].descuento)/100)/(1+res[i].igv_porcentage/100)*(res[i].igv_porcentage/100),
                                porcentage:res[i].igv_porcentage
                            });
                        }else{
                            this.impuestos.push({
                                id:res[i].igv_id,
                                nombre:this.getimpuestos[validar].nombre,
                                cantidad:res[i].precio_unitario*(100-res[i].descuento)/100,
                                porcentage:res[i].igv_porcentage
                            });
                        } 
                    }
                }
                validar=null;
                validar2=null;
                if(res[i].isc_id>0 && res[i].isc_id!=null){
                    while(j<this.getimpuestos.length){
                        if(res[i].isc_id==this.getimpuestos[j].id){
                            validar=j;
                        }
                        j++;
                    }
                    j=0;
                    while(k<this.impuestos.length){
                        if(this.impuestos[k].id==res[i].isc_id){
                            validar2=k;
                        }
                        k++;
                    }
                    k=0
                    if(validar2!=null){
                        this.impuestos[validar2].cantidad+=res[i].precio_unitario*res[i].cantidad*(res[i].isc_porcentage/100)*(100-res[i].descuento)/100;
                    }else{
                        this.impuestos.push({
                            id:res[i].isc_id,
                            nombre:this.getimpuestos[validar].nombre,
                            cantidad:res[i].precio_unitario*res[i].cantidad*(res[i].isc_porcentage/100)*(100-res[i].descuento)/100,
                            porcentage:res[i].isc_porcentage
                        });
                    }    
                }
                validar=null;
                validar2=null;
                if(res[i].otro_id>0 && res[i].otro_id!=null){
                    while(j<this.getimpuestos.length){
                        if(res[i].otro_id==this.getimpuestos[j].id){
                            validar=j;
                        }
                        j++;
                    }
                    j=0;
                    if(this.impuestos.length>0){
                        while(k<this.impuestos.length){
                            if(this.impuestos[k].id==res[i].otro_id){
                                validar2=k;
                            }
                            k++;
                        }
                        k=0
                        if(validar2!=null){
                            this.impuestos[validar2].cantidad+=res[i].precio_unitario*(res[i].otro_porcentage/100)*(100-res[i].descuento)/100;
                        }else{
                            this.impuestos.push({
                                id:res[i].otro_id,
                                nombre:this.getimpuestos[validar].nombre,
                                cantidad:res[i].precio_unitario*(res[i].otro_porcentage/100)*(100-res[i].descuento)/100,
                                porcentage:res[i].otro_porcentage
                            });
                        }
                    }else{
                        this.impuestos.push({
                            id:res[i].otro_id,
                            nombre:this.getimpuestos[validar].nombre,
                            cantidad:res[i].precio_unitario*(res[i].otro_porcentage/100)*(100-res[i].descuento)/100,
                            porcentage:res[i].otro_porcentage
                        });
                    }
                }
                validar=null;
                validar2=null;
                i++;
            }
            i=0
            let sum=0;
        
            while(i<this.impuestos.length){
                sum+=parseFloat(this.impuestos[i].cantidad)
                i++;
            }
            this.total=Math.round((parseFloat(this.subtotal)+sum)*100)/100;
            console.log(sum);
        }
        
        this.letrado=this.conversor.NumeroALetras(parseFloat(this.total));
        
        console.log(this.total);
        console.log(this.impuestos);
    }
    continuarnota(){
        if(this.d_ventas.length>0){
            console.log("entro")
            this.getserie(this.anular.serie.charAt(0))
        }else{
            console.log('q pex?')
        }
    }
    limpiar(){
        this.cargando=null;
        this.limpiarventas();
        this.anular=new AnularModel(null,null,null,null,null,null,null,this.user.id,null,null,null,null,null,0,0,this.fecha );
        
    }
    anularventa(ven){

    }
    traerventastotales(id){
        this.vertodaslasventas=true;
        this.verventas=id;
        this.destruirtablaventas();
        this.reconstruirtablaventas(id);
    }
    mostrardetalleventas(arregloventa){
        this.modal.style.display = "block";
        this.getventa=arregloventa;
        console.log(this.getventa);
    }
    cerrarmodaldetalles(){
        this.anulardetalle=new AnularDetalleModel(null,null,null,null,null,null,null,null,null,0);
        this.modaldetalles.style.display = "none";
    }
    cerrarmodal(){
        this.modal.style.display = "none";
        
    }
    alertaerror(){
        swal({
            position: 'center',
            icon: "warning",
            title: 'ocurio un error ',
            text:'intentelo de nuevo mas tarde',
            buttons: true,
            timer: 1500,
          })
    }
    alertaecho(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Guardado',
            text:'La nota se genero corectamente',
            buttons: false,
            timer: 3000
        })
        this._AnularService.clear();
        this._AnularService.almacenarnotacredito(this.anular,this.ventas,this.d_ventasvarante,this.impuestos);
        this.router.navigate(['/'+this.user.rol+'/imprimir/nota']);
    }
    alertaactualizado(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Insertado',
            text:'La Caja se Actualizo correctamente',
            buttons: false,
            timer: 3000
          })
    }
    alertaeliminado(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Eliminado',
            text:'La Caja se Elimino correctamente',
            buttons: false,
            timer: 3000
          })
    }
    alertaeliminar(ven){
        swal({
            title: "esta seguro de anular esta venta",
            text: "se anulara la venta en el sistema y se enviara un reporte a la SUNAT",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
            }
        });
    }
    tabla(){
        setTimeout(function(){
            $(document).ready(function() {
                 $('#mytable').DataTable();
            });
        },2000);
    }
    tablaventas(){
        //this.mostrar();
       
        setTimeout(function(){
            $(function(){
                 $('#tablaventas').DataTable({
                    "paging":   false,
                    "ordering": false,
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ]
                 });
            });
        },3000);
    }
    destruirtablaventas(){	
        var table = $('#tablaventas').DataTable();
        table .clear() ;
        $('#tablaventas').DataTable().destroy();
    }
    reconstruirtablaventas(id){
        this.tablaventas();
        
    }
    destruir(){	
        var table = $('#mytable').DataTable(); table .clear() ;
        $('#mytable').DataTable().destroy();
    }
    reconstruir(id){
        this.tabla();
    }
}