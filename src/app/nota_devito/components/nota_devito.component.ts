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
import {DetalleCaja} from '../../ventas/modelos/detalle_cajas';
import {DetalleVentasModel} from '../../ventas/modelos/detalle_ventas';
import {DetalleVentasService} from '../../ventas/services/DetalleVentas.service';
import {VentasService} from '../../ventas/services/Ventas.service';
import { VentasModel } from '../../ventas/modelos/ventas';
import {DetalleNotaDevitoModel} from '../models/detalle_nota_devito';
import {EmpresaService} from '../../empresa/services/empresa.service';
import {EmpresaModel} from '../../empresa/models/empresa';
import{NotaDevitoModel} from '../models/nota_devito';
import {AnularService} from '../../ventas/services/notadecredito.service';
import {NotaDebitoService} from '../services/nota_devito.service';
import { ImpuestoService } from "../../impuesto/services/impuesto.service";

import { environment } from '../../../environments/environment';
import{conversordenumerosaletras} from '../../ventas/services/numeroaletras.service';
import { isNumber } from "util";
import { nullSafeIsEquivalent } from "@angular/compiler/src/output/output_ast";
import { nota_debitoModule } from "../nota_devito.module";

declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
    selector:'nota-credito',
    templateUrl:'../views/nota_devito.html',
    providers:[ToastService,SucursalService,DetalleVentasService,ImpuestoService,conversordenumerosaletras,VentasService,EmpresaService,NotaDebitoService]
})
export class NotaDevitoComponent{
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
    public nota_debito:NotaDevitoModel;
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
    public nota_debito_detalle:DetalleNotaDevitoModel;
    public notadebitodetalle:Array<DetalleNotaDevitoModel>=[];
    public detalletenporal:DetalleVentasModel;
    public siguiente=null;
    public validarnumero=null;
    public arregloparaelfinal:Array<any>=[];
    public contenido=null;
    public contenidoOriginal=null;
    public total04=0;
    public fecha=null;
    public empresa:EmpresaModel;
    public totalventa=0;
    public validarglobal=false;
    public url;
    public getimpuestos:Array<any>=[];
    imageUrl: string = "assets/images/1.png";
    public editardetallenotadebito=null;
    public aimpiestos=false;
    constructor(
        private _SucursalService:SucursalService,
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
        this.titulo="Nota de Devito"
        this.toastr.setRootViewContainerRef(vcr);
        //this.tablaventas();
        this.user=this.auth.getUser();
        this.url=environment.api_url; 
        this.imageUrl=this.url+'/imagenes/2.png';
    }
    ngOnInit(){
        this.tiponotas[0]=['Intereces por Mora','01'];
        this.tiponotas[1]=['Aumento en el Valor','02'];
        this.tiponotas[2]=['Penalidades/otros Conceptos','03'];
        this.modaldetalles=document.getElementById('modaldetalles');
        var f=new Date();
        let mes=f.getMonth()*1+1;
        this.fecha=f.getDate()+'/'+mes+'/'+f.getFullYear();
        this.traerimpuestos();
        this.textserie=document.getElementById('textserie');
        this.textnumero=document.getElementById('textnumero');
        this.textmotivo=document.getElementById('textmotivo');
        this.combotipos=document.getElementById('combotipo');
        this.nota_debito=new NotaDevitoModel(null,null,null,null,null,null,this.user.id,null,null,null,null,0,0,this.fecha);
        this.nota_debito_detalle=new DetalleNotaDevitoModel(null,null,null,null,null,null,null,null,null,0);
        this.getventa=new VentasModel(null,null,null,null,null,null,null,null,null,null,this.user.id,null,null,null,null,0,null,null,null,null,null,null,null);
        this.detalletenporal=new DetalleVentasModel(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null)
        this.ventas=new VentasModel(null,null,null,null,null,null,null,null,null,null,this.user.id,null,null,null,null,0,null,null,null,null,null,null,null);
        this.empresa=new EmpresaModel(null,null,null,null,null,null,null,null,null,null,null,null,null)
        this.getempresa();
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
    traerimpuestos(){
        this._ImpuestoService.getImpuestos().subscribe(
            res=>{
                this.getimpuestos=res;
                console.log(this.impuestos)
            },
            err=>{
                console.log(<any>err)
            }
        )
    }
    verificarserie(botton){
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
                    this._DetalleVentasService.getdetalleventasporserie(this.nota_debito.serie+'-'+this.nota_debito.numero).subscribe(
                        res=>{
                            if(res.result!=false){
                                this.id_venta=res[0].id_venta;
                                this.ventas=res[0];
                                this.d_ventas=res;
                                this.nota_debito.id_venta=res[0].id_venta;
                                this.totalventa=res[0].total;
                                console.log(this.ventas);
                                console.log(this.d_ventas);
                                if(this.nota_debito.serie.charAt(0)=="B"){
                                    this.tipoventa="BOLETA"
                                }else{
                                    this.tipoventa="FACTURA";
                                }
                                if(botton=='ir'){
                                    this.nota_debito.serie_nota=this.seriedenota;
                                    this.nombretiponota=this.tiponotas[parseInt(this.nota_debito.tipo_nota)-1][0];
                                    console.log(this.nombretiponota);
                                    this.veritems=parseInt(this.nota_debito.tipo_nota);
                                    this.textserie.disabled = true;
                                    this.textnumero.disabled = true;
                                    this.textmotivo.disabled=true;
                                    this.combotipos.disabled=true;
                                    if(this.nota_debito.tipo_nota=="01"  || this.nota_debito.tipo_nota=="03"){
                                        //this.total=res[0].total
                                        /*while(i<res.length){
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
                                        this.verresumenfinal=1;*/
                                    }
                                    if(this.nota_debito.tipo_nota=="02"){
                                        this.verresumenfinal=null;
                                        this.tipodeitem="Aumentara"
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
    notafinal(res){
        let i=0,j=0,k=0,validar=null,validar2=null;
        if(this.nota_debito.serie.charAt(0)=="B"){
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
    limitarserie(){
        this.limpiarventas();
        this.nota_debito.id_venta=null;
        this.cargando=null;
        this.nota_debito.serie=this.nota_debito.serie.toUpperCase();
        if(this.textserie.value.length==4){
            console.log(this.textserie.value.length);
            this.textnumero.focus();
        }
    }
    limpiarventas(){
        while(0<this.d_ventas.length){
            this.d_ventas.splice(0,1);
        }
    }
    cambionumero(){
        this.nota_debito.id_venta=null;
        this.cargando=null;
        this.limpiarventas();
        if(this.textnumero.value.length==0){
            console.log(this.textnumero.value.length)
            this.textserie.focus();
        }
    }
    vermodaldetallenota(array){
        
        this.editardetallenotadebito=null;
        this.nota_debito_detalle=new DetalleNotaDevitoModel(null,null,null,null,null,null,null,null,null,0);
        console.log(array)
        this.modaldetalles.style.display = "block";
        this.detalletenporal=array;
        console.log(this.getventa);
    }
    disgregarimpuesto(){
        
        if(this.aimpiestos==false){
            this.aimpiestos=true;
        }else{
            this.aimpiestos=false;
        }
        this.calcularcantidadaumentoitem();
    }
    cerrarmodaldetalles(){
        this.aimpiestos=false;
        this.nota_debito_detalle=new DetalleNotaDevitoModel(null,null,null,null,null,null,null,null,null,0);
        this.modaldetalles.style.display = "none";
    }
    adddetallenota(){
        let i=0;
        while(i<this.notadebitodetalle.length){
            if(this.detalletenporal.id==this.notadebitodetalle[i].id_detalle_venta){
                this.notadebitodetalle.splice(i,1);
            }
            i++
        }
        i=0;
        this.nota_debito_detalle.id_detalle_venta=this.detalletenporal.id;
        while(i<this.d_ventas.length){
            if(this.d_ventas[i].id==this.detalletenporal.id){
                this.d_ventas[i].id_venta=null;
            }
            i++;
        }
        this.notadebitodetalle.push(this.nota_debito_detalle);
        this.cerrarmodaldetalles();
        console.log(this.d_ventas);
        console.log(this.notadebitodetalle);

    }
    verdetalleagregado(array){
        this.editardetallenotadebito=1;
        let i=0;
        this.modaldetalles.style.display = "block";
        this.detalletenporal=array;
        while(i<this.notadebitodetalle.length){
            if(array.id==this.notadebitodetalle[i].id_detalle_venta){
                this.nota_debito_detalle=this.notadebitodetalle[i];
            }
            i++;
        }
    }
    calcularcantidadaumentoitem(){
        /*var numero=this.anulardetalle.cantidad.toString();
        let cant=numero.charAt(0);*/
        this.textvalidar=document.getElementById('txtval');
        let numeroigv=0,i=0,validado=null,numeromaximo=0;
        numeroigv=this.nota_debito_detalle.cantidad_total*(18/100)
        if(this.nota_debito.serie.charAt(0)=="F"){
            if(isNaN(numeroigv) || numeroigv==0){
                this.validarnumero=false;
                this.nota_debito_detalle.igv=0;
                this.nota_debito_detalle.isc=0;
                this.nota_debito_detalle.otro=0;
                this.nota_debito_detalle.cantidad=0;  
                this.nota_debito_detalle.cantidad_sinigv=0;
                this.textvalidar.focus();
                this.textvalidar.select();
            }else{
                this.nota_debito_detalle.cantidad=this.nota_debito_detalle.cantidad_total*1/(1+(this.detalletenporal.isc_porcentage*1+this.detalletenporal.otro_porcentage*1)/100);
                this.nota_debito_detalle.igv=Math.round(this.nota_debito_detalle.cantidad*100)/100;
                while(i<this.getimpuestos.length){
                    if(this.detalletenporal.igv_id==this.getimpuestos[i].id){
                        if(this.getimpuestos[i].nombre.toUpperCase()=="GRAVADOS"){
                            this.nota_debito_detalle.cantidad_sinigv=Math.round(this.nota_debito_detalle.cantidad/(1+(this.detalletenporal.igv_porcentage*1/100))*100)/100;
                            this.nota_debito_detalle.igv=Math.round((this.nota_debito_detalle.cantidad/(1+(this.detalletenporal.igv_porcentage*1/100)))*(this.detalletenporal.igv_porcentage/100)*100)/100;
                            validado=i;
                        }
                    }
                    i++
                }
                this.validarnumero=true;
                this.nota_debito_detalle.isc=Math.round(this.nota_debito_detalle.cantidad*(this.detalletenporal.isc_porcentage/100)*100)/100;
                this.nota_debito_detalle.otro=Math.round(this.nota_debito_detalle.cantidad*(this.detalletenporal.otro_porcentage/100)*100)/100;

                
            }
        }else{
            if(this.nota_debito_detalle.cantidad>0){
                this.validarnumero=true;
            }
        }
    }
    quitardetallenota(){
        let i=0,j=0;
        while(i<this.notadebitodetalle.length){
            if(this.detalletenporal.id==this.notadebitodetalle[i].id_detalle_venta){
                this.notadebitodetalle.splice(i,1);
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
        this.nota_debito_detalle=new DetalleNotaDevitoModel(null,null,null,null,null,null,null,null,null,0);
        this.modaldetalles.style.display = "none";
        console.log(this.d_ventas);
        console.log(this.notadebitodetalle);
    }
    finalizar02(){
        this.verresumenfinal=1;
        let i=0,j=0;
        while(i<this.notadebitodetalle.length){
            while(j<this.d_ventas.length){
                console.log(this.d_ventas[j])
                console.log(this.notadebitodetalle[i]);
                if(this.notadebitodetalle[i].id_detalle_venta==this.d_ventas[j].id){
                    console.log('entro');
                    this.d_ventas[j].pago_tarjeta=this.d_ventas[j].precio_unitario;
                    this.d_ventas[j].observaciones=this.d_ventas[j].nombre_producto;
                    this.d_ventas[j].pago_efectivo=this.d_ventas[j].cantidad;
                    this.d_ventas[j].precio_unitario=this.notadebitodetalle[i].cantidad;
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
}