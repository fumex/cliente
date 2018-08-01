import { Component,ViewContainerRef } from "@angular/core";
import { DetalleCaja } from "../modelos/detalle_almacen";
import { DetalleCajasService } from '../services/DetalleCajas.service';
import { DetalleCajasUsuarioService } from '../../cajas/services/detalle.cajas.usuarios.services';
import { AlmaceneService} from '../../almacen/services/almacen.services';
import { producto} from '../../productos/modelos/productos';
import { detalleimpuestoservice} from '../../detalle_impuesto/services/detalle_impuesto.service';
import { ClienteService} from '../../cliente/services/cliente.service';
import { VentasModel } from "../modelos/ventas";
import { DetalleVentasModel } from "../modelos/detalle_ventas";
import { CantidadMOdel} from '../modelos/cantidad';
import { conversordenumerosaletras} from '../services/numeroaletras.service';
import { User } from "../../auth/interfaces/user.model";
import { AuthService } from "../../auth/services/auth.service";

import {ToastService} from '../../toastalert/service/toasts.service'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { environment } from "../../../environments/environment";
import { ProductoModule } from "../../productos/productos.module";

import {VentasService} from '../services/Ventas.service';

declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'ventas',
    templateUrl:'../views/ventas.component.html',
    providers:[VentasService,DetalleCajasService,ToastService,DetalleCajasUsuarioService,AlmaceneService,detalleimpuestoservice,ClienteService,conversordenumerosaletras]
})
export class VentasComponent{
    letrado: string;
    public contador=0;
    public clientes :any;
    public DetalleCaja:DetalleCaja;
    public titulo;
    public user:User;
    public productos:Array<any>=[];
    public pro:ProductoModule;
    public nombre;
    public apertura=null;
    public cajas:any;
    public id_caja=0;
    public data:Array<any>=[];
    public url=environment.api_url+'/imagenesproductos'; 
    imageUrl: string = "assets/images/1.png";
    public factura=false;
    public boleta=true;
    public tabs;
    public inps;
    public clientselec=null;
    public acepclient=0;
    public namescli=null;
    public cantcajas=0;
    public detallev:DetalleVentasModel;
    public detalleventas:Array<DetalleVentasModel>=[];
    public ventas:VentasModel;
    public impuestos:Array<any>=[];
    public inicio:Array<any>=[];
    public igv:number;
    public autorizarboton=0;
    public total=0;
    public editarcant=null;
    public prodcant=null;
    public valorcant=null;
    public enviado=false;
    public verusuarios=null;
    public verpago=null;
    public tipodepago=null;
    public combo=null;
    public tipotrageta=null;
    public nombretipo=null;
    public vuelto=null;
    public texttar=null;
    public textefec=null;
    public numerofac=null;
    public numerobol=null;
    public idcliente=null;
    public arreglocantidad:CantidadMOdel;
    public activin=null;
    public sumamonedas=0;
    constructor(
        private _DetalleCajasService:DetalleCajasService,
        private _DetalleCajasUsuarioService:DetalleCajasUsuarioService,
        private  _AlmaceneService:AlmaceneService,
        private _detalleimpuestoservice:detalleimpuestoservice,
        private _VentasService:VentasService,
        private conversor:conversordenumerosaletras,
        private _ClienteService:ClienteService,
        private auth:AuthService,
        private toaste:ToastService,
        public toastr: ToastsManager,
        vcr: ViewContainerRef
    ){

        this.toastr.setRootViewContainerRef(vcr);
        this.user=this.auth.getUser();
        this.titulo="Ventas";
        this.DetalleCaja=new DetalleCaja(null,null,null,null,null,null,null,null,null);
        this.detallev=new DetalleVentasModel(null,null,null,null,0,null,null,0,0,null,null);
        this.ventas=new VentasModel(null,null,null,null,null,0,0,0,null,null);
        this.arreglocantidad=new CantidadMOdel(0,0,0,0,0,0,0,0,0,0,0);
        this.igv=0;
        this.letrado=this.conversor.NumeroALetras(0);
    }
    
    ngOnInit(){
        this.obtenercajas();
        this.traercliente();
        //this.alertaapertura();
        //this.data = [];
        for(var j=0;j<5;j++){
            this.inicio.push({
                id:j+1,
                descripcion:"",
                precio_unitario:"",
                cantidad:"",});
        }
        console.log(this.inicio)
        for(var i = 3; i < 5; i++)
        {
        
            this.data.push({ id:i, preg:[] });
            this.data[ this.data.length-1].preg.push( {pid: i, preg: "Aqui pregunta" });
            this.data[ this.data.length-1].preg.push( {pid: i+1, preg: "Aqui pregunta2" });
        }
        
        console.log( this.data);
        this.obtenerdocuemntos();
    }
    obtenerdocuemntos(){
        this._VentasService.obtenerdocumentos().subscribe(
            res=>{
                console.log(res);
                this.numerofac=res.f;
                this.numerobol=res.b;
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    sumartotal(){
        let k=0;
        this.total=0;
        let sumaimp=0;
        while(k<this.impuestos.length){
            sumaimp=sumaimp+Math.round(this.impuestos[k].cantidad*100)/100;
            k++
        }
        this.total=this.ventas.total+sumaimp;
    }
    addproducto(indice,arreglopro){
        this.inps=document.getElementById('cantidadeditada');
        this.contador++;
        let j=0;
        let i=0;
        let cant=0;
        let k=0;
        let cont=0;
        this.total=0;
        let sumaimp=0;
        this.enviado=true;
        if(arreglopro.cantidad>arreglopro.stock){
            this.toaste.errorAlerta('no existe esa cantidad en stock','Error!!!!');
            this.prodcant=arreglopro.id;
            this.inps.focus();
            this.inps.select();
        }else{
           
            while(i<this.detalleventas.length){
                if(arreglopro.id===this.detalleventas[i].id_producto){
                    this.detalleventas[i].cantidad=this.detalleventas[i].cantidad+1;
                    cant=1;
                }
                i=i+1;
            }
            if(cant===0){
                this.inicio.splice(0,1);
                console.log(this.inicio)
                this.detallev.id=indice;
                this.detallev.id_producto=arreglopro.id;
                this.detallev.precio_unitario=arreglopro.precio_venta;
                this.detallev.cantidad=arreglopro.cantidad;
                this.detallev.descripcion=arreglopro.nombre_producto;
                this.detallev.codigo=arreglopro.codigo;
                this.detalleventas.push(this.detallev);
                this.detallev=new DetalleVentasModel(null,null,null,null,0,null,null,null,null,null,null);
    
            }
            if(this.boleta==true){
                this.ventas.total=this.ventas.total+(parseFloat(arreglopro.precio_venta)*arreglopro.cantidad);
            }else{
            i=0;
            while(i<arreglopro.preg.length){
                while(j<this.impuestos.length){
                    if(arreglopro.preg[i].tipo==="IGV"){
                        if(arreglopro.preg[i].nombre==="gravados"){
                            if(this.impuestos[j].nombre==="IGV"){
                                this.ventas.total=this.ventas.total+((parseFloat(arreglopro.precio_venta)*arreglopro.cantidad)/(1+arreglopro.preg[i].porcentaje/100));
                                this.impuestos[j].cantidad=this.impuestos[j].cantidad+(parseFloat(arreglopro.precio_venta)*arreglopro.cantidad)/(1+arreglopro.preg[i].porcentaje/100)*(arreglopro.preg[i].porcentaje/100);
                                cont++
                            }
                        }else{
                            if(this.impuestos[j].nombre===arreglopro.preg[i].nombre){
                                //falta preguntar como se pone en la factura
                                //this.ventas.total=this.ventas.total+parseFloat(arreglopro.precio_venta);
                                this.impuestos[j].cantidad=this.impuestos[j].cantidad+(parseFloat(arreglopro.precio_venta)*arreglopro.cantidad);
                                cont++
                            }
                        }
                    }else{
                        if(this.impuestos[j].nombre===arreglopro.preg[i].nombre){
                            //this.ventas.total=this.ventas.total+(parseFloat(arreglopro.precio_venta)/(1+arreglopro.preg[i].porcentaje/100));
                            this.impuestos[j].cantidad=this.impuestos[j].cantidad+(parseFloat(arreglopro.precio_venta)*arreglopro.cantidad)*(arreglopro.preg[i].porcentaje/100);
                            cont++
                        }
                    }
                   
                    j++;
                }
                if(cont===0){
                    if(arreglopro.preg[i].tipo==="IGV"){
                        if(arreglopro.preg[i].nombre==="gravados"){
                            this.ventas.total=this.ventas.total+((parseFloat(arreglopro.precio_venta)*arreglopro.cantidad)/(1+arreglopro.preg[i].porcentaje/100));
                            this.impuestos.push({nombre:"IGV",
                            porcentaje:arreglopro.preg[i].porcentaje,cantidad:(parseFloat(arreglopro.precio_venta)*arreglopro.cantidad)/(1+arreglopro.preg[i].porcentaje/100)*(arreglopro.preg[i].porcentaje/100)});
                        }else{
                            //falta preguntar como se pone en la factura
                            //this.ventas.total=this.ventas.total+(parseFloat(arreglopro.precio_venta));
                            this.impuestos.push({nombre:arreglopro.preg[i].nombre,
                            porcentaje:arreglopro.preg[i].porcentaje,cantidad:(parseFloat(arreglopro.precio_venta)*arreglopro.cantidad)});
                        }
                    }else{
                        //this.ventas.total=this.ventas.total+(parseFloat(arreglopro.precio_venta)/(1+arreglopro.preg[i].porcentaje/100));
                        this.impuestos.push({nombre:arreglopro.preg[i].nombre,
                        porcentaje:arreglopro.preg[i].porcentaje,cantidad:(parseFloat(arreglopro.precio_venta)*(arreglopro.cantidad)*arreglopro.preg[i].porcentaje/100)});
                    }                    
                }
               
                j=0;
                cont=0;
                i=i+1;
                
            }
            this.sumartotal();
            
            }
            this.letrado=this.conversor.NumeroALetras(Math.round( this.ventas.total *100)/100);
            arreglopro.cantidad=null;
        }
        
       
    }
    agregartarjeta(){
        this.inps=document.getElementById('combotarjeta');
        this.ventas.tarjeta=this.inps.value;
        console.log(this.inps.value)
    }
    guardarventa(){
        if(this.boleta==true){
            this.ventas.serie_venta=this.numerobol;
            this.total=this.ventas.total
        }else{
            this.ventas.serie_venta=this.numerofac;
        }
        this.ventas.total=Math.round(this.total*100)/100;
        this.verpago==null;
        console.log(this.ventas)
        console.log(this.detalleventas)
    }
    seleccionartipo(){
        this.combo=document.getElementById('comboselect');
        console.log(this.combo.value);
        this.nombretipo=this.combo.value;
        if(this.combo.value==="Efectivo"){
            this.tipotrageta=null;
            this.ventas.pago_tarjeta=0;
        }else{
            if(this.combo.value==='Tarjeta'){
                this.ventas.pago_tarjeta=Math.round( this.total *100)/100;
                this.ventas.pago_efectivo=0;
            }else{
                this.ventas.pago_tarjeta=0;
                this.ventas.pago_efectivo=0;
            }
            this.tipotrageta=1;
        }
        
    }
    sumarcuadros(){
        this.texttar=document.getElementById('pagotarjeta');
        this.textefec=document.getElementById('pagoefectivo');
        let cant:number;
        cant=this.ventas.pago_efectivo*1+this.ventas.pago_tarjeta*1;
        if(this.total>cant){
            this.vuelto=this.conversor.NumeroALetras(0);
        }else{
            this.vuelto=this.conversor.NumeroALetras(Math.round((cant-this.total) *10)/10);
        }
        
        console.log(this.ventas.pago_efectivo+this.ventas.pago_tarjeta)
    }
    quitarproducto(indice,arreglo){
        console.log(arreglo);
        let i=0;
        let j=0;
        let k=0;
        let n=0;
        if(this.inicio.length<5){
            this.inicio.push({
                id:this.detalleventas.length+1,
                descripcion:"",
                precio_unitario:"",
                cantidad:"",});
        }
        console.log(this.impuestos);
        while(i<this.productos.length){
            if(this.productos[i].id===arreglo.id_producto){
                if(this.productos[i].codigo===arreglo.codigo){
                    if(this.boleta==true){
                        this.ventas.total=this.ventas.total-parseFloat(arreglo.precio_unitario)*arreglo.cantidad;
                    }else{
                        while(j<this.productos[i].preg.length){
                            console.log(this.productos[i].preg[j].nombre);
                            if(this.productos[i].preg[j].tipo==="IGV"){
                                if(this.productos[i].preg[j].nombre==="gravados"){
                                    this.ventas.total=this.ventas.total-((arreglo.precio_unitario*arreglo.cantidad)/(1+this.productos[i].preg[j].porcentaje/100));
                                    while(k<this.impuestos.length){
                                        if(this.impuestos[k].nombre==="IGV"){
                                            n=(((arreglo.precio_unitario*arreglo.cantidad)/(1+this.productos[i].preg[j].porcentaje/100))*this.productos[i].preg[j].porcentaje/100);
                                            console.log(n);
                                            this.impuestos[k].cantidad=(this.impuestos[k].cantidad-(n));
                                            console.log(this.impuestos[k].cantidad)
                                            if(Math.round(this.impuestos[k].cantidad*100)/100===0){
                                                this.impuestos.splice(k,1);
                                            }
                                        }
                                        k++;
                                    }
                                }else{
                                    while(k<this.impuestos.length){
                                        if(this.impuestos[k].nombre===this.productos[i].preg[j].nombre){
                                            this.impuestos[k].cantidad=(this.impuestos[k].cantidad-arreglo.precio_unitario*arreglo.cantidad);
                                            
                                            if(Math.round(this.impuestos[k].cantidad*100)/100===0){
                                                this.impuestos.splice(k,1);
                                            }
                                        }
                                        k++;
                                    } 
                                }
                            k=0;
                            }else{
                                while(k<this.impuestos.length){
                                    if(this.impuestos[k].nombre===this.productos[i].preg[j].nombre){
                                        console.log(this.productos[i].preg[j].nombre);
                                           
                                        this.impuestos[k].cantidad=(this.impuestos[k].cantidad-(arreglo.precio_unitario*arreglo.cantidad)*this.productos[i].preg[j].porcentaje/100);
                                        console.log( this.impuestos[k].cantidad);
                                        console.log((arreglo.precio_unitario*arreglo.cantidad)*this.productos[i].preg[j].porcentaje/100)
                                        if(Math.round(this.impuestos[k].cantidad*100)/100===0){
                                            this.impuestos.splice(k,1);
                                        }
                                        }
                                    k++;
                                } 
                            }
                            j++;
                            k=0;
                        }
                    }
                }
                this.productos[i].cantidad=1; 
            }
            i++
            j=0;
        }
        this.sumartotal();
        
        this.prodcant=null;
        this.detalleventas.splice(indice,1);
        this.editarcant=null;
        this.letrado=this.conversor.NumeroALetras(Math.round( this.ventas.total *100)/100);
    }

    pagar(){
        if(this.boleta==true){  
            this.total=this.ventas.total;
        }
        this.tabs=document.getElementById('tabpago')
        this.tabs.click();
        this.verpago=1;
    }
    limpiar(){
        this.inps=document.getElementById('firstName');
        this.inps.value="";
        this.idcliente=null;
        this.clientselec=null;
        let i=0;
        let j=0;
        while(i<this.detalleventas.length){
            while(j<this.productos.length){
                if(this.detalleventas[i].id_producto===this.productos[j].id){
                    this.productos[j].cantidad=1;
                }
                j++;
            }
            j=0;
            i++;
        }
        i=0;
        while(i<this.detalleventas.length){
            this.detalleventas.splice(0,1);
        }
        while(i<this.impuestos.length){
            this.impuestos.splice(0,1);
        }
        this.ventas=new VentasModel(null,null,null,null,null,null,null,null,null,null);
    }


    agregarunidadpro(indice,arreglo){
        console.log(arreglo);
        let i=0;
        let j=0;
        let k=0;
        let n=0;
        while(i<this.productos.length){
            if(this.productos[i].id===arreglo.id_producto){
                if(arreglo.cantidad>=this.productos[i].stock){
                    this.toaste.errorAlerta('no existe esa cantidad en stock','Error!!!!');
                }else{
                    arreglo.cantidad=(arreglo.cantidad*1)+1;
                    if(this.boleta==true){
                        this.ventas.total=this.ventas.total+parseFloat(arreglo.precio_unitario);
                    }else{
                        while(j<this.productos[i].preg.length){
                            console.log(this.productos[i].preg[j].nombre);
                            if(this.productos[i].preg[j].tipo==="IGV"){
                                if(this.productos[i].preg[j].nombre==="gravados"){
                                    this.ventas.total=this.ventas.total+((arreglo.precio_unitario)/(1+this.productos[i].preg[j].porcentaje/100));
                                    while(k<this.impuestos.length){
                                        if(this.impuestos[k].nombre==="IGV"){
                                            n=(((arreglo.precio_unitario)/(1+this.productos[i].preg[j].porcentaje/100))*this.productos[i].preg[j].porcentaje/100);
                                            this.impuestos[k].cantidad=this.impuestos[k].cantidad+(n);
                                        }
                                        k++;
                                    }
                                }else{
                                    while(k<this.impuestos.length){
                                        if(this.impuestos[k].nombre===this.productos[i].preg[j].nombre){
                                            this.impuestos[k].cantidad=this.impuestos[k].cantidad+parseFloat(arreglo.precio_unitario);
                                            
                                        }
                                        k++;
                                    } 
                                }
                            k=0;
                            }else{
                                while(k<this.impuestos.length){
                                    if(this.impuestos[k].nombre===this.productos[i].preg[j].nombre){
                                        this.impuestos[k].cantidad=(this.impuestos[k].cantidad+parseFloat((arreglo.precio_unitario))*this.productos[i].preg[j].porcentaje/100);
                                    }
                                    k++;
                                } 
                            }
                            j++;
                            k=0;
                        }
                    }
                 i=this.productos.length;
                }
                i++
                j=0;
            }
            this.sumartotal();
        }
        this.letrado=this.conversor.NumeroALetras(Math.round( this.ventas.total *100)/100);
    }

    quitarunidadpro(indice,arreglo){
        let i=0;
        let j=0;
        let k=0;
        let n=0;
        while(i<this.productos.length){
            if(this.productos[i].id===arreglo.id_producto){
                if(this.productos[i].codigo===arreglo.codigo){
                    if(this.boleta==true){
                        this.ventas.total=this.ventas.total-arreglo.precio_unitario;
                    }else{
                        while(j<this.productos[i].preg.length){
                            if(this.productos[i].preg[j].tipo==="IGV"){
                                if(this.productos[i].preg[j].nombre==="gravados"){
                                    this.ventas.total=this.ventas.total-((arreglo.precio_unitario)/(1+this.productos[i].preg[j].porcentaje/100));
                                    while(k<this.impuestos.length){
                                        if(this.impuestos[k].nombre==="IGV"){
                                            this.impuestos[k].cantidad=(this.impuestos[k].cantidad-(arreglo.precio_unitario)/(1+this.productos[i].preg[j].porcentaje/100)*this.productos[i].preg[j].porcentaje/100);
                                            if(Math.round(this.impuestos[k].cantidad*100)/100 ===0){
                                                console.log("boro 1")
                                                this.impuestos.splice(k,1);
                                            }
                                            
                                        }
                                        k++;
                                    }
                                }else{
                                    while(k<this.impuestos.length){
                                        if(this.impuestos[k].nombre===this.productos[i].preg[j].nombre){
                                            this.impuestos[k].cantidad=(this.impuestos[k].cantidad-(arreglo.precio_unitario));
                                            
                                            if(Math.round(this.impuestos[k].cantidad*100)/100===0){
                                                console.log("boro2")
                                                this.impuestos.splice(k,1);
                                            }
                                        }
                                        k++;
                                    } 
                                }
                            k=0;
                            }else{
                                while(k<this.impuestos.length){
                                    if(this.impuestos[k].nombre===this.productos[i].preg[j].nombre){
                                        this.impuestos[k].cantidad=(this.impuestos[k].cantidad-(arreglo.precio_unitario)*this.productos[i].preg[j].porcentaje/100);
                                        console.log(this.impuestos[k].cantidad);
                                        if(Math.round(this.impuestos[k].cantidad*100)/100===0){
                                            
                                            console.log("boro3")
                                           
                                            this.impuestos.splice(k,1);
                                        }
                                    }
                                    k++;
                                } 
                            }
                            j++;
                            k=0;
                        }
                    }
                }
            }
            if(arreglo.cantidad===1){
                this.productos[i].cantidad=1; 
            }
            i++
            j=0;
            this.sumartotal();
        }
        if(arreglo.cantidad-1===0){
            this.detalleventas.splice(indice,1);
            this.prodcant=null;
            this.inicio.push({
                id:this.detalleventas.length+1,
                descripcion:"",
                precio_unitario:"",
                cantidad:"",});
        }else{
            arreglo.cantidad=arreglo.cantidad-1;
        }
        this.letrado=this.conversor.NumeroALetras(Math.round( this.ventas.total *100)/100);
    }

    editarcantpro(id,cant){
        
        this.prodcant=id;
    }
   
    seleccionarbfactura(){
        if(this.detalleventas.length>0){
           this.alertafactura();
        }else{
            this.factura=true;
            this.boleta=false;
        }
        
    }
    seleccionarboleta(){
        if(this.detalleventas.length>0){
            this.alertaboleta();
        }else{
            this.factura=false;
            this.boleta=true;
        }
    }
    irausuarios(){
        this.verusuarios=1; 
        this.tabs=document.getElementById('tabcli');
        
        this.tabs.click();
        this.recontruirtclient();
    }
    seleccionarcliente(id,nombre,doc,nrodoc){
        this.idcliente=id;
        this.clientselec=id;
        this.namescli=nombre+' - '+doc+' : '+nrodoc;
        this.namescli=this.namescli.toUpperCase();
        this.acepclient=1;
        
    }
    mandarusuario(){
        this.inps=document.getElementById('firstName');

        this.inps.value=this.namescli;
        
        this.tabs=document.getElementById('tabini');
        this.tabs.click();
        this.verusuarios=null;
        this.detruirtclient();
        this.ventas.id_cliente=this.idcliente;
    }
    cancelarcliente(){
        this.tabs=document.getElementById('tabini');
        this.tabs.click();
        this.detruirtclient();
    }
    traercliente(){
        this._ClienteService.getClientes().subscribe(
            res=>{
                this.clientes=res;
                console.log(res);
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    aperturarcaja(id){
        this.DetalleCaja.id_caja=id;
        this.DetalleCaja.id_usuario=this.user.id;
        this.mostarproductos();
        console.log(this.DetalleCaja);
        this.id_caja=id;
    }
    sumartodaslasmonedas(){
        this.sumamonedas=0;
        if(this.arreglocantidad.c10>0){
            console.log(this.sumamonedas)
            console.log(this.arreglocantidad.c10)
            this.sumamonedas+=this.arreglocantidad.c10*0.1;
        }
        if(this.arreglocantidad.c20>0){
            this.sumamonedas+=this.arreglocantidad.c20*0.2;
        }
        if(this.arreglocantidad.c50>0){
            this.sumamonedas+=this.arreglocantidad.c50*0.5;
        }
        if(this.arreglocantidad.m01>0){
            this.sumamonedas+=this.arreglocantidad.m01*1;
        }
        if(this.arreglocantidad.m02>0){
            this.sumamonedas+=this.arreglocantidad.m02*2;
        }
        if(this.arreglocantidad.m05>0){
            this.sumamonedas+=this.arreglocantidad.m05*5;
        }
        if(this.arreglocantidad.b10>0){
            this.sumamonedas+=this.arreglocantidad.b10*10;
        }
        if(this.arreglocantidad.b20>0){
            this.sumamonedas+=this.arreglocantidad.b20*20;
        }
        if(this.arreglocantidad.b50>0){
            this.sumamonedas+=this.arreglocantidad.b50*50;
        }
        if(this.arreglocantidad.c01>0){
            this.sumamonedas+=this.arreglocantidad.c01*100;
        }
        if(this.arreglocantidad.c02>0){
            this.sumamonedas+=this.arreglocantidad.c02*200;
        }
    }
    mandarmontodeapertura(){
        let cantidadconcat="";
        this.DetalleCaja.monto_apertura="";
        if(this.arreglocantidad.c10>0){
            this.DetalleCaja.monto_apertura+="c10|"+this.arreglocantidad.c10+"|";
            this.sumamonedas+=this.arreglocantidad.c10*0.1;
        }
        if(this.arreglocantidad.c20>0){
            this.DetalleCaja.monto_apertura+="c20|"+this.arreglocantidad.c20+"|";
            this.sumamonedas+=this.arreglocantidad.c20*0.2;
        }
        if(this.arreglocantidad.c50>0){
            this.DetalleCaja.monto_apertura+="c50|"+this.arreglocantidad.c50+"|";
            this.sumamonedas+=this.arreglocantidad.c50*0.5;
        }
        if(this.arreglocantidad.m01>0){
            this.DetalleCaja.monto_apertura+="m01|"+this.arreglocantidad.m01+"|";
            this.sumamonedas+=this.arreglocantidad.m01*1;
        }
        if(this.arreglocantidad.m02>0){
            this.DetalleCaja.monto_apertura+="m02|"+this.arreglocantidad.m02+"|";
            this.sumamonedas+=this.arreglocantidad.m02*2;
        }
        if(this.arreglocantidad.m05>0){
            this.DetalleCaja.monto_apertura+="m05|"+this.arreglocantidad.m05+"|";
            this.sumamonedas+=this.arreglocantidad.m05*5;
        }
        if(this.arreglocantidad.b10>0){
            this.DetalleCaja.monto_apertura+="b10|"+this.arreglocantidad.b10+"|";
            this.sumamonedas+=this.arreglocantidad.b10*10;
        }
        if(this.arreglocantidad.b20>0){
            this.DetalleCaja.monto_apertura+="b20|"+this.arreglocantidad.b20+"|";
            this.sumamonedas+=this.arreglocantidad.b20*20;
        }
        if(this.arreglocantidad.b50>0){
            this.DetalleCaja.monto_apertura+="b50|"+this.arreglocantidad.b50+"|";
            this.sumamonedas+=this.arreglocantidad.b50*50;
        }
        if(this.arreglocantidad.c01>0){
            this.DetalleCaja.monto_apertura+="c01|"+this.arreglocantidad.c01+"|";
            this.sumamonedas+=this.arreglocantidad.c01*100;
        }
        if(this.arreglocantidad.c02>0){
            this.DetalleCaja.monto_apertura+="c02|"+this.arreglocantidad.c02+"|";
            this.sumamonedas+=this.arreglocantidad.c02*200;
        }
        console.log(this.DetalleCaja.monto_apertura);
        this.arreglocantidad
        
    }
    montoapertura(n){
        
        switch(n) {
            case 0.1:
                this.arreglocantidad.c10+=1;
                break;
            case 0.2:
                this.arreglocantidad.c20+=1;
                break;
            case 0.5:
                this.arreglocantidad.c50+=1;
                break;
            case 1:
                this.arreglocantidad.m01+=1;
                break;
            case 2:
                this.arreglocantidad.m02+=1;
                break;
            case 5:
                this.arreglocantidad.m05+=1;
                break;
            case 10:
                this.arreglocantidad.b10+=1;
                break;
            case 20:
                this.arreglocantidad.b20+=1;
                break;
            case 50:
                this.arreglocantidad.b50+=1;
                break;
            case 100:
                this.arreglocantidad.c01+=1;
                break;
            case 200:
                this.arreglocantidad.c02+=1;
                break;
        }
        this.sumartodaslasmonedas();
    }
    quitarmoneda(n){
        switch(n) {
            case 0.1:
                if(this.arreglocantidad.c10>0){
                    this.arreglocantidad.c10-=1;
                }
                break;
            case 0.2:
                if(this.arreglocantidad.c20>0){
                    this.arreglocantidad.c20-=1;
                }
                break;
            case 0.5:
               if(this.arreglocantidad.c50>0){
                    this.arreglocantidad.c50-=1;
                }
                break;
            case 1:
                if(this.arreglocantidad.m01>0){
                    this.arreglocantidad.m01-=1;
                }
                break;
            case 2:
                if(this.arreglocantidad.m02>0){
                    this.arreglocantidad.m02-=1;
                }
                break;
            case 5:
                if(this.arreglocantidad.m05>0){
                    this.arreglocantidad.m05-=1;
                }
                break;
            case 10:
                if(this.arreglocantidad.b10>0){
                    this.arreglocantidad.b10-=1;
                }
                break;
            case 20:
                if(this.arreglocantidad.b20>0){
                    this.arreglocantidad.b20-=1;
                }
                break;
            case 50:
                if(this.arreglocantidad.b50>0){
                    this.arreglocantidad.b50+=1;
                }
                break;
            case 100:
               if(this.arreglocantidad.c01>0){
                    this.arreglocantidad.c01-=1;
                }
                break;
            case 200:
                if(this.arreglocantidad.c02>0){
                    this.arreglocantidad.c02-=1;
                }
                break;
        }
        this.sumartodaslasmonedas();
    }
    activarinput(nombre){
        console.log(nombre);
        this.activin=nombre;
    }
    sumarcantidadapertura(){
        let i=0;
        while(i<11){
            this.arreglocantidad[0]
            i++;
        }
    }
    mostarproductos(){
        let indice=0;
        this._DetalleCajasService.AperturaCaja(this.DetalleCaja).subscribe(
            res=>{
                if(res.code==200){
                    this._AlmaceneService.SeleccionarAlmacenporcaja(this.id_caja).subscribe(
                        res=>{
                           this.ventas.id_caja=this.DetalleCaja.id_caja;
                            
                           while(indice<res.length){
                               this.pro=res[indice];
                               this.productos.push({
                                id:res[indice].id,
                                imagen:res[indice].imagen,
                                nombre_producto:res[indice].nombre_producto,
                                descripcion:res[indice].descripcion,
                                unidad:res[indice].unidad,
                                nombre:res[indice].nombre,
                                precio_venta:res[indice].precio_venta,
                                stock:res[indice].stock,
                                codigo:res[indice].codigo,
                                cantidad:1,
                                preg:[]});
                                this.mostrarimpuestosdeproductos(res[indice].id,indice);
                               indice=indice+1;
                           }
                           this.tablacajas();  
                
                            console.log(this.productos);
                            console.log(this.productos[0].preg);
                        },
                        err=>{
                            console.log(<any>err);
                        }
                    );
                }
                console.log(res);
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    mostrarimpuestosdeproductos(id,index){
        let indice=0;
        this._detalleimpuestoservice.seleccionardetealle(id).subscribe(
            res=>{
                while(indice<res.length){
                    this.productos[index].preg.push({
                        nombre:res[indice].nombre   ,
                        porcentaje:res[indice].porcentaje,
                        tipo:res[indice].tipo,
                    });
                    indice=indice+1;
                }
               if(res.length===this.productos[index].preg.length){
                   this.autorizarboton++;
               }
               console.log(this.autorizarboton);
               
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    obtenercajas(){
        this._DetalleCajasUsuarioService.selectusuariocajas(this.user.id).subscribe(
            res=>{
                
                this.cajas=res;
                this.cantcajas=res.length
                console.log(this.cantcajas);
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    tablaclientes(){
        setTimeout(function(){
            $(document).ready(function() {
                 $('#tabclientes').DataTable({
                    "pageLength": 5,
                 });
                
            });
        },2000);
    }
    tablacajas(){
        setTimeout(function(){
            $(document).ready(function() {
                 $('#tablacajas').DataTable({
                    "lengthChange": false,
                    "pageLength": 5,
                 });
                
            });
        },2000);
    }
    detruirtcajas(){
        var table = $('#tablacajas').DataTable(); table .clear() ;
        $('#tablacajas').DataTable().destroy();
    }
    recontruirtcajas(){
        this.mostarproductos();
        this.tablacajas();
    }
    detruirtclient(){
        var table = $('#tabclientes').DataTable(); table .clear() ;
        $('#tabclientes').DataTable().destroy();
    }
    recontruirtclient(){
        this.traercliente();
        this.tablaclientes();
    }
    alertaerror(){
        swal({
            position: 'center',
            icon: "warning",
            title: 'ocurio un error ',
            text:'intentelo de nuevo mas tarde',
            buttons: true,
            timer: 3000
          })
    }
    alertaecho(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Insertado',
            text:'La Unidad se agrego correctamente',
            buttons: true,
            timer: 1500
          })
    }
    alertafactura(){
        swal({
            title: "esta seguro de cambiar de documento ?",
            text: "se eliminaran las ventas actuales",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                this.limpiar();
                this.factura=true;
                this.boleta=false;
            }
        });
    }
    alertaboleta(){
        swal({
            title: "esta seguro de cambiar de documento ?",
            text: "se eliminaran las ventas actuales",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                this.limpiar();
                this.factura=false;
                this.boleta=true;
            }
        });
    }
}