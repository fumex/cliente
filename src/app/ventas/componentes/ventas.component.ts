import { Component,ViewContainerRef } from "@angular/core";
import { DetalleCaja } from "../modelos/detalle_cajas";
import { DetalleCajasService } from '../services/DetalleCajas.service';
import { ActivatedRoute, Router } from '@angular/router';
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
import { DetalleVentasService } from "../services/DetalleVentas.service";
import {ToastService} from '../../toastalert/service/toasts.service'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { environment } from "../../../environments/environment";
import { ProductoModule } from "../../productos/productos.module";
import {inventario} from '../../inventario/modelos/inventario'
import {VentasService} from '../services/Ventas.service';
import {MonedaService} from '../../moneda/services/moneda.service';
import {TipoPagoService} from '../../tipo_pago/services/tipo_pago.service';
import {EntidadFinancieraService} from '../../entidad_financiera/services/entidad_financiera.service';
import {codproMdel} from '../../pago/models/codigo_productos';
import {codigoProductosModel} from '../modelos/codigo_productos';
import { AssertNotNull } from "@angular/compiler";
import {EmpresaService} from '../../empresa/services/empresa.service';
import {EmpresaModel} from '../../empresa/models/empresa';
import { NULL_INJECTOR } from "@angular/core/src/render3/component";

declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'ventas',
    templateUrl:'../views/ventas.component.html',
    providers:[EmpresaService,DetalleVentasService,VentasService,DetalleCajasService,ToastService,DetalleCajasUsuarioService,AlmaceneService,detalleimpuestoservice,ClienteService,conversordenumerosaletras]
})
export class VentasComponent{
    letrado: string;
    public contador=0;
    public monedas:Array<any>=[];
    public pago:any;
    public entidad:any;
    public clientes :any;
    public DetalleCaja:DetalleCaja;
    public titulo;
    public user:User;
    public productos:Array<any>=[];
    public cod_pro:codigoProductosModel;
    public codigo_productos:Array<codigoProductosModel>=[];
    public pro:ProductoModule;
    public nombre;
    public idlastventa=null;
    public apertura=null;
    public cajas:any;
    public id_caja=0;
    public nombre_producto_seleccionado=null;
    public url=environment.api_url+'/imagenesproductos'; 
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
    public inventario:inventario;
    public editarcant=null;
    public prodcant=null;
    public valorcant=null;
    public enviado=false;
    public verusuarios=null;
    public verpago=null;
    public vercierre=null;
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
    public modalventa;
    public antsubtotal=null;
    public emailvalidado=null;
    public empresa:EmpresaModel;

    public fecha;
    public hora;
    imageUrl: string = "assets/images/1.png";
    public gratuito=null;
    constructor(
        private router:Router,
        private _DetalleCajasService:DetalleCajasService,
        private _DetalleCajasUsuarioService:DetalleCajasUsuarioService,
        private _monedaservice:MonedaService,
        private _tipopagoservice:TipoPagoService,
        private _entidadservice:EntidadFinancieraService,
        private  _AlmaceneService:AlmaceneService,
        private _DetalleVentasService:DetalleVentasService,
        private _detalleimpuestoservice:detalleimpuestoservice,
        private _VentasService:VentasService,
        private conversor:conversordenumerosaletras,
        private _ClienteService:ClienteService,
        private auth:AuthService,
        private toaste:ToastService,
        public toastr: ToastsManager,
        private _EmpresaService:EmpresaService,
        vcr: ViewContainerRef
    ){
        
        this.toastr.setRootViewContainerRef(vcr);
        this.user=this.auth.getUser();
        this.titulo="Ventas";
        this.imageUrl=this.url+'/imagenes/2.png';
        this.DetalleCaja=new DetalleCaja(null,null,null," ",null,null,null,null,null,null);
        this.detallev=new DetalleVentasModel(null,null,null,null,0,null,null,0,0,0,null,0,0,0,0,0,0,0,0,0,null,null);
        this.ventas=new VentasModel(null,null,null,null,null,0,0,0,null,null,this.user.id,0,null,null,null,0,null,null,null,null,null,null,null,null,0,0);
        this.arreglocantidad=new CantidadMOdel(0,0,0,0,0,0,0,0,0,0,0);
        this.inventario=new inventario(null,null,null,null,null,null,null,null,null,null,null,null);
        this.cod_pro=new codigoProductosModel(null,null,null,null,null,null);
        this.empresa=new EmpresaModel(null,null,null,null,null,null,null,null,null,null,null,null,null,null,false,false,null)
        this.igv=0;
        this.letrado=this.conversor.NumeroALetras(0);
        this.iniciodeusuario();
    }
    
    ngOnInit(){
        this.modalventa=document.getElementById('modalventa');
        window.onclick = function(event) {
            if (event.target == this.document.getElementById('modalventa') ) {
                this.document.getElementById('modalventa').style.display = "none";
            }
        }
        //this.traercliente();
        for(var j=0;j<5;j++){
            this.inicio.push({
                id:j+1,
                descripcion:"",
                precio_unitario:"",
                cantidad:"",});
        }
        console.log(this.inicio)
        //this.obtenerdocuemntos();
        this.getentidad();
        this.getmonedas();
        this.gettipopago();
        this.getempresa();
    }
    irdocgratuito(){
        if(this.gratuito==true){
            this.gratuito=false;
        }else{
            this.gratuito=true;
        }
    }
    validaremail(){
        this.emailvalidado=this.ventas.email;
    }
    guardaremailvalid(){
        this.emailvalidado=null;
    }
    cancelareditemail(){
        this.ventas.email=this.emailvalidado;
        this.emailvalidado=null;
    }
    getempresa(){
        this._EmpresaService.dataEmpresa().subscribe(
            res=>{
                this.empresa=res;
                console.log(this.empresa);
                this.imageUrl=environment.api_url+'/empresa-img/'+this.empresa.imagen;
            },
            err=>{
                console.log(<any>err);
            }
        )
    }

    cerramodalventa(){
        //this.modalventa.className="modal-contente animated zoomOut";
        this.cancelareditemail();
        this.modalventa.style.display = "none";
    }
    abrirmodalventas(){
        let i=0,j=0,validar=null;
        while(i<this.detalleventas.length){
            while(j<this.codigo_productos.length){
                if(this.detalleventas[i].id_producto==this.codigo_productos[j].id_detalle_pago){
                    console.log(this.codigo_productos[j].serie)
                    if(this.codigo_productos[j].serie!=null){
                        validar=1;
                    }
                }
                j++;
            }
            console.log(validar)
            if(validar!=null){
                this.detalleventas[i].estado=true;
            }
            j=0;
            validar=null;
            i++;
        }
        console.log(this.detalleventas);
        console.log(this.codigo_productos);
        this.modalventa.style.display = "block";
    }
    cerrarcaja(){
        this.verpago=null;
        this.tabs=document.getElementById('tabcierre');
        this.tabs.click();
        this.vercierre=1;
    }
    volveraventadepagos(){
        if(this.boleta==true){  
            this.ventas.total=this.total;
        }else{
            
            this.total=this.ventas.total;
            this.ventas.total=this.antsubtotal;
        }
        this.volveraventas();
    }
    volveraventas(){
        this.tabs=document.getElementById('tabini'); 
        this.tabs.click();
        this.vercierre=null;
        this.verpago=null;
        this.DetalleCaja.monto_cierre_efectivo=null;
        this.DetalleCaja.monto_cierre_tarjeta=null;
    }
    iniciodeusuario(){
        this._DetalleCajasService.buscarusuario(this.user.id).subscribe(
            res=>{
                if(res.code==300){
                    this.DetalleCaja.id_caja=res.mensage;
                    this.DetalleCaja.id_usuario=this.user.id;
                    this.id_caja=res.mensage;
                    this.traerproductos();
                }else{
                    this.obtenercajas();    
                }
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    obtenerdocuemntos(){
        this._VentasService.obtenerdocumentos().subscribe(
            res=>{
                console.log(res);
                this.numerofac=res.f; 
                this.numerobol=res.b;
                if(res.code==200){
                    this.tabs=document.getElementById('tabini');
                    this.tabs.click();
                    if(this.boleta==true){
                        this.ventas.serie_venta=this.numerobol;
                        this.total=this.ventas.total
                    }else{
                        this.ventas.serie_venta=this.numerofac;
                    }
                    console.log(this.numerobol,'-',this.numerofac)
                    
                    
                    this.guardarventas();
                    
                    this.ventas.total=Math.round(this.total*100)/100;
                    console.log(this.ventas)
                    console.log(this.detalleventas)
                }
             
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
        this.total=Math.round((this.ventas.total+sumaimp)*100)/100;
    }

    agregardescuento(arreglopro){
        let i=0,j=0,k=0,n=0;
        let precioanterior=0;
        let precioreal=0;
        while(i<this.productos.length){
            if(this.productos[i].id==arreglopro.id_producto){
                precioreal=this.productos[i].precio_venta-Math.round(arreglopro.descuento_cant*100)/100;
                console.log(precioreal);
                console.log(this.productos[i].precio_venta);
            }
            i++;
        }
        i=0;
        swal({
            title:"Agregar descuento",
            text:"(descuento maximo "+arreglopro.descuento_maximo+"%)",
            content: "input",
            button: "Agregar",
          })
          .then((value) => {
            if(isNaN(parseInt(value)) || parseInt(value)>arreglopro.descuento_maximo || parseInt(value)<0){
                if( parseInt(value)<0){
                    this.toaste.WarningAlert('debe colocar un valor mayor o igual a 0','Alerta ');
                } 
                if(parseInt(value)>arreglopro.descuento_maximo ){
                    this.toaste.WarningAlert('debe colocar una cantidad menor a '+arreglopro.descuento_maximo,'Alerta ');
                }
                if(isNaN(parseInt(value))){
                    this.toaste.WarningAlert('debe colocar un valor unitario ','Alerta ');
                }
            }else{
                
                arreglopro.descuento=parseInt(value);
                while(i<this.productos.length){
                    if(this.productos[i].id===arreglopro.id_producto && this.productos[i].codigo===arreglopro.codigo){ 
                        if(this.boleta===true){
                            
                            arreglopro.descuento_cant=(Math.round((arreglopro.precio_unitario * parseInt(value)/100)*100)/100)*arreglopro.cantidad;
                            this.ventas.total=this.ventas.total-(arreglopro.descuento_cant);
                            this.total=this.ventas.total;
                        }else{
                            
                            arreglopro.descuento_cant=(Math.round((arreglopro.precio_unitario * parseInt(value)/100)*100)/100)*arreglopro.cantidad;
                            precioanterior=arreglopro.precio_unitario-arreglopro.descuento_cant;
                            console.log(precioanterior);
                            console.log(precioreal);
                            while(j<this.productos[i].preg.length){
                                if(this.productos[i].preg[j].tipo==="IGV"){
                                    if(this.productos[i].preg[j].nombre.toUpperCase()==="GRAVADOS"){
                                        console.log(this.ventas.total-((precioreal*arreglopro.cantidad)/(1+this.productos[i].preg[j].porcentaje/100)));
                                        this.ventas.total-=((precioreal*arreglopro.cantidad)/(1+this.productos[i].preg[j].porcentaje/100));
                                        this.ventas.total+=((precioanterior*arreglopro.cantidad)/(1+this.productos[i].preg[j].porcentaje/100));     
                                        console.log('es gravado');
                                        while(k<this.impuestos.length){
                                            if(this.impuestos[k].nombre==="IGV"){
                                                this.impuestos[k].cantidad-=((precioreal*arreglopro.cantidad)/(1+this.productos[i].preg[j].porcentaje/100))*this.productos[i].preg[j].porcentaje/100;
                                                console.log(this.impuestos[k].cantidad);
                                                n=((precioanterior*arreglopro.cantidad)/(1+this.productos[i].preg[j].porcentaje/100))*this.productos[i].preg[j].porcentaje/100;
                                                console.log(n);
                                                this.impuestos[k].cantidad+=n;
                                                arreglopro.igv=n;
                                            }
                                            k++;
                                        }
                                    }else{
                                        while(k<this.impuestos.length){
                                            if(this.impuestos[k].nombre===this.productos[i].preg[j].nombre){
                                                this.impuestos[k].cantidad-=precioreal*arreglopro.cantidad;
                                                this.impuestos[k].cantidad+=precioanterior*arreglopro.cantidad;
                                                arreglopro.igv=precioanterior*arreglopro.cantidad;
                                                
                                            }
                                            k++;
                                        } 
                                    }
                                k=0;
                                }else{
                                     while(k<this.impuestos.length){
                                        if(this.impuestos[k].nombre===this.productos[i].preg[j].nombre){
                                            this.impuestos[k].cantidad-=(precioreal*arreglopro.cantidad)*this.productos[i].preg[j].porcentaje/100;
                                            this.impuestos[k].cantidad+=(precioanterior*arreglopro.cantidad)*this.productos[i].preg[j].porcentaje/100;
                                            if(this.productos[i].preg[j].tipo.toUpperCase()==="ISC"){
                                                arreglopro.isc=(precioanterior*arreglopro.cantidad)*this.productos[i].preg[j].porcentaje/100;
                                            }else{
                                                arreglopro.otro=(precioanterior*arreglopro.cantidad)*this.productos[i].preg[j].porcentaje/100;
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
                    i++
                    j=0;
                }
                console.log(arreglopro);
                this.sumartotal();
            }
            console.log(this.detalleventas);
            this.letrado=this.conversor.NumeroALetras(Math.round( this.total *100)/100);
          });

    }
    addproducto(indice,arreglopro,descuento){
        console.log(this.productos);
        console.log(arreglopro);
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
            this.cod_pro.id_detalle_pago=arreglopro.id;
            this.cod_pro.id_codigo_producto=arreglopro.id_codigo;
            this.cod_pro.cantidad=arreglopro.cantidad;
            this.cod_pro.cantidad_maxima=arreglopro.stock;
            this.cod_pro.serie=arreglopro.numero_de_serie;
            this.codigo_productos.push(this.cod_pro);
            this.cod_pro=new codigoProductosModel(null,null,null,null,null,null);
            

            while(i<this.detalleventas.length){
                if(arreglopro.id===this.detalleventas[i].id_producto){
                    this.detalleventas[i].cantidad=this.detalleventas[i].cantidad*1+1;
                    this.detalleventas[i].cantidad_maxima+=arreglopro.stock;
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
                this.detallev.descuento=0;
                this.detallev.codigo=arreglopro.codigo;
                this.detallev.id_codigo_producto=arreglopro.id_codigo;
                this.detallev.cantidad_maxima=arreglopro.stock;

                

                if(arreglopro.descuento_maximo>0){
                    this.detallev.descripcion=arreglopro.nombre_producto;
                    this.detallev.descuento_maximo=arreglopro.descuento_maximo;
                }else{
                    this.detallev.descripcion=arreglopro.nombre_producto;
                    this.detallev.descuento_maximo=0;
                }
                if(this.boleta!=true){
                    for(let l=0;l< arreglopro.preg.length;l++){
                        if(arreglopro.preg[l].tipo=="IGV"){
                            if(arreglopro.preg[l].nombre.toUpperCase()==="GRAVADOS"){
                                this.detallev.igv=(parseFloat(arreglopro.precio_venta)/(1+parseFloat(arreglopro.preg[l].porcentaje)/100))*(parseFloat(arreglopro.preg[l].porcentaje)/100);
                                this.detallev.igv_id=arreglopro.preg[l].id;
                                this.detallev.igv_porcentage=arreglopro.preg[l].porcentaje;
                            }else{
                                this.detallev.igv=parseFloat(arreglopro.precio_venta);
                                this.detallev.igv_id=arreglopro.preg[l].id;
                                this.detallev.igv_porcentage=arreglopro.preg[l].porcentaje;
                            }
                        }
                        if(arreglopro.preg[l].tipo=="ISC"){
                            this.detallev.isc=parseFloat(arreglopro.precio_venta)*(arreglopro.preg[l].porcentaje/100);
                            this.detallev.isc_id=arreglopro.preg[l].id;
                            this.detallev.isc_porcentage=arreglopro.preg[l].porcentaje;
                        }
                        if(arreglopro.preg[l].tipo=="OTRO"){
                            this.detallev.otro=parseFloat(arreglopro.precio_venta)*(arreglopro.preg[l].porcentaje/100);
                            this.detallev.otro_id=arreglopro.preg[l].id;
                            this.detallev.otro_porcentage=arreglopro.preg[l].porcentaje;
                        }
                    }
                }
               
                this.detalleventas.push(this.detallev);
                this.detallev=new DetalleVentasModel(null,null,null,null,0,null,null,null,null,null,null,0,0,0,0,0,0,0,0,0,null,null);

                
    
            }
            if(this.boleta==true){
                this.ventas.total=this.ventas.total+(parseFloat(arreglopro.precio_venta)*arreglopro.cantidad);
                this.total=this.ventas.total;
            }else{
            i=0;
            console.log(arreglopro.preg[i].nombre.toUpperCase());
            while(i<arreglopro.preg.length){
                while(j<this.impuestos.length){
                    if(arreglopro.preg[i].tipo.toUpperCase()==="IGV"){
                        console.log(arreglopro.preg[i].nombre.toUpperCase());
                        if(arreglopro.preg[i].nombre.toUpperCase()==="GRAVADOS"){
                            if(this.impuestos[j].nombre.toUpperCase()==="IGV"){
                                this.ventas.total=this.ventas.total+((parseFloat(arreglopro.precio_venta)*arreglopro.cantidad)/(1+arreglopro.preg[i].porcentaje/100));
                                this.impuestos[j].cantidad=this.impuestos[j].cantidad+(parseFloat(arreglopro.precio_venta)*arreglopro.cantidad)/(1+arreglopro.preg[i].porcentaje/100)*(arreglopro.preg[i].porcentaje/100);
                                cont++
                            }
                        }else{
                            if(this.impuestos[j].nombre===arreglopro.preg[i].nombre){
                                this.impuestos[j].cantidad=this.impuestos[j].cantidad+(parseFloat(arreglopro.precio_venta)*arreglopro.cantidad);
                                cont++
                            }
                        }
                    }else{
                        if(this.impuestos[j].nombre===arreglopro.preg[i].nombre){
                            this.impuestos[j].cantidad=this.impuestos[j].cantidad+(parseFloat(arreglopro.precio_venta)*arreglopro.cantidad)*(arreglopro.preg[i].porcentaje/100);
                            cont++
                        }
                    }
                   
                    j++;
                }
                if(cont===0){
                    if(arreglopro.preg[i].tipo.toUpperCase()==="IGV"){
                        this.detalleventas
                        if( arreglopro.preg[i].nombre.toUpperCase()==="GRAVADOS"){
                            this.ventas.total=this.ventas.total+((parseFloat(arreglopro.precio_venta)*arreglopro.cantidad)/(1+arreglopro.preg[i].porcentaje/100));
                            this.impuestos.push({nombre:"IGV",
                            porcentaje:arreglopro.preg[i].porcentaje,
                            cantidad:(parseFloat(arreglopro.precio_venta)*arreglopro.cantidad)/(1+arreglopro.preg[i].porcentaje/100)*(arreglopro.preg[i].porcentaje/100),
                            tipo:arreglopro.preg[i].tipo
                        });
                            
                        }else{
                            this.impuestos.push({nombre:arreglopro.preg[i].nombre,
                            porcentaje:arreglopro.preg[i].porcentaje,
                            cantidad:(parseFloat(arreglopro.precio_venta)*arreglopro.cantidad),
                            tipo:arreglopro.preg[i].tipo
                        });
                        }
                    
                    }else{
                        this.impuestos.push({nombre:arreglopro.preg[i].nombre,
                        porcentaje:arreglopro.preg[i].porcentaje,
                        cantidad:(parseFloat(arreglopro.precio_venta)*(arreglopro.cantidad)*arreglopro.preg[i].porcentaje/100),
                        tipo:arreglopro.preg[i].tipo
                    });
                    }                    
                }
               
                j=0;
                cont=0;
                i=i+1;
                
            }
            this.sumartotal();
            
            }
            this.letrado=this.conversor.NumeroALetras(Math.round( this.total *100)/100);
            arreglopro.cantidad=null;
        }
        console.log(this.detalleventas)
        console.log(this.codigo_productos);
    }
    agregartarjeta(){
        this.inps=document.getElementById('combotarjeta');
        this.ventas.tarjeta=this.inps.value;
        console.log(this.inps.value)
    }
    guardarventa(){
        let i=0;
        while(i<this.impuestos.length){
            if(this.impuestos[i].tipo.toUpperCase()=="IGV"){
                this.ventas.igv+=this.impuestos[i].cantidad;
            }
            if(this.impuestos[i].tipo.toUpperCase()=="ISC"){
                this.ventas.isc+=this.impuestos[i].cantidad;
            }
            if(this.impuestos[i].tipo.toUpperCase()=="OTRO"){
                this.ventas.otro+=this.impuestos[i].cantidad;
            }
            i++
        }
        this.obtenerdocuemntos();   
        
    }
    guardarventas(){
        console.log(this.ventas)
        var f=new Date();
        this.fecha=f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear()+" "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds();
        this.ventas.letrado=this.letrado;
        this._VentasService.GuardarVenta(this.ventas).subscribe(
            res=>{
                console.log(res);
                if(res.code==200){
                    this.guardardetalleventas();
                    //this.ventas.serie_venta=res.serie;
                    //this.idlastventa=res.serie;
                    console.log(this.ventas)
                }
            },
            err=>{
                console.log(<any>err);
                this.limpiar(); 
                this.vuelto=0;
                this.verusuarios=null;
                this.verpago=null;
            }
        );
    }
    guardardetalleventas(){
        let i=0,j=0;
        let respuesta=0;
        let validate=1;
        let iddetalleventyas=null;
        while(i<this.detalleventas.length){
            this._DetalleVentasService.guardardetalleventas(this.detalleventas[i]).subscribe(
                res=>{
                    
                    if(res.code==200){
                        console.log(res);
                        iddetalleventyas=res.id;
                    }else{
                        respuesta+=1;
                        console.log(respuesta);

                    }
                },
                err=>{
                    console.log(<any>err);
                    respuesta+=1
                    /*this.limpiar(); 
                    this.vuelto=0;
                    this.verusuarios=null;
                    this.verpago=null;*/
                }
            );
            console.log(this.codigo_productos);
            while(j<this.codigo_productos.length){
                if(this.codigo_productos[j].id_detalle_pago==this.detalleventas[i].id_producto){
                    this.codigo_productos[j].id_detalle_pago=iddetalleventyas;
                    this._DetalleVentasService.editarcodigoproductos(this.codigo_productos[j]).subscribe(
                        res=>{
                            console.log(res);
                            
                        },
                        err=>{
                            console.log(err)
                            respuesta+=1
                        }
                    )
                }
                j++
            }
            this.inventario=new inventario(null,null,null,this.detalleventas[i].id_producto,null,null,this.detalleventas[i].cantidad,null,this.detalleventas[i].precio_unitario,null,this.user.id,this.detalleventas[i].codigo);
            this._DetalleVentasService.guardarmoveinv(this.inventario).subscribe(
                res=>{
                    if(res.code==200){
                        this.inventario=new inventario(null,null,null,null,null,null,null,null,null,null,null,null);
                    }else{
                        respuesta+=1;
                        console.log(respuesta);

                    }
                },
                err=>{
                    console.log(<any>err);
                    respuesta+=1
                    /*this.limpiar(); 
                    this.vuelto=0;
                    this.verusuarios=null;
                    this.verpago=null;*/
                }
            );
            j=0;
            i++;
            console.log(respuesta);
            if(i==this.detalleventas.length && respuesta==0){
                this.alertaventa();
                this._VentasService.almacennardatosventas(this.ventas,this.detalleventas,this.impuestos,this.codigo_productos);
                this._VentasService.almacenardato('fecha',this.fecha);
                //this.obtenerdocuemntos();
                /*this.limpiar(); 
                this.vuelto=0;
                this.verusuarios=null;
                this.verpago=null;*/
            }

        }
    
    }
    guardarcodigos(){
        let i=0;
        while(i<this.codigo_productos.length){
            
            i++;
        }
    }
    vermoneda(moenda){
        let i=0;
        console.log(this.ventas.id_moneda)
        while(i<this.monedas.length){
            if(this.ventas.id_moneda==this.monedas[i].id){
                this.ventas.moneda=this.monedas[i].moneda;
            }
            i++
        }
        console.log(this.ventas);
    }
    seleccionartipo(){
        let i=0;
        while(i<this.pago.length){
            console.log(this.pago[i]);
            if(this.ventas.tipopago==this.pago[i].id){
                this.combo=this.pago[i].tipo;
                this.nombretipo=this.pago[i].tipo.toUpperCase();
            }
            i++;
        }
        console.log(this.nombretipo);
        console.log(this.combo.toUpperCase());
        if(this.combo.toUpperCase()=="EFECTIVO"){
            console.log('entro');
            this.tipotrageta=null;
            this.ventas.pago_tarjeta=0;
        }else{
            this.ventas.pago_tarjeta=Math.round( this.total *100)/100;
            this.ventas.pago_efectivo=0;
            this.tipotrageta=1;
        }
        /*
        console.log(this.combo.value);
        
        if(this.combo.value==="Efectivo"){
            
        }else{
            if(this.combo.value==='Tarjeta'){
                
            }else{
                this.ventas.pago_tarjeta=0;
                this.ventas.pago_efectivo=0;
            }
            
        }*/
        
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
    getmonedas(){
        this._monedaservice.getMonedas().subscribe(
            res=>{
                console.log(res);
                this.monedas=res;
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    gettipopago(){
        this._tipopagoservice.getTipoPagos().subscribe(
            res=>{
                console.log(res);
                this.pago=res;
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    getentidad(){
        this._entidadservice.entidades().subscribe(
            res=>{
                console.log(res);
                this.entidad=res;
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    quitarproducto(indice,arreglo){
        console.log(arreglo);
        let i=0;
        let j=0;
        let k=0;
        let n=0;
        let icod=0;
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
                if(this.productos[i].id_codigo===arreglo.id_codigo_producto){
                    if(this.boleta==true){
                        this.ventas.total-=(parseFloat(arreglo.precio_unitario)*arreglo.cantidad)-arreglo.descuento_cant;
                        this.total=this.ventas.total;
                    }else{
                        while(j<this.productos[i].preg.length){
                            console.log(this.productos[i].preg[j].nombre);
                            if(this.productos[i].preg[j].tipo==="IGV"){
                                if(this.productos[i].preg[j].nombre==="gravados"){
                                    this.ventas.total=this.ventas.total-((arreglo.precio_unitario-arreglo.descuento_cant)*arreglo.cantidad)/(1+this.productos[i].preg[j].porcentaje/100);
                                    console.log(this.ventas.total)
                                    while(k<this.impuestos.length){
                                        if(this.impuestos[k].nombre==="IGV"){
                                            n=(((arreglo.precio_unitario-arreglo.descuento_cant)*arreglo.cantidad)/(1+this.productos[i].preg[j].porcentaje/100))*this.productos[i].preg[j].porcentaje/100;
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
                                            this.impuestos[k].cantidad=this.impuestos[k].cantidad-((arreglo.precio_unitario-arreglo.descuento_cant)*arreglo.cantidad);
                                            
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
                                           
                                        this.impuestos[k].cantidad=this.impuestos[k].cantidad-((arreglo.precio_unitario-arreglo.descuento_cant)*arreglo.cantidad)*this.productos[i].preg[j].porcentaje/100;
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
                while(icod<this.codigo_productos.length){
                    if(this.codigo_productos[icod].id_detalle_pago==arreglo.id_producto){
                        this.codigo_productos.splice(icod,1);
                    }else{
                        icod++;
                    }
                }   
            }
            i++
            j=0;
        }
        this.sumartotal();
        
        this.prodcant=null;
        this.detalleventas.splice(indice,1);
        this.editarcant=null;
        this.letrado=this.conversor.NumeroALetras(Math.round( this.total *100)/100);
        console.log(this.codigo_productos);
    }
    limpiarcodigo_productos(){
        let i=0;
        while(i<this.codigo_productos.length){
            this.codigo_productos.splice(0,1);
        }
    }
    pagar(){
        if(this.boleta==true){  
            this.total=this.ventas.total;
            this.antsubtotal=this.total;
        }else{
            this.ventas.subtotal=this.ventas.total;
            this.antsubtotal=this.ventas.total;
            this.ventas.total=this.total;

        }
        console.log(this.ventas);
        this.tabs=document.getElementById('tabpago')
        this.tabs.click();
        this.getentidad();
        this.getmonedas();
        this.gettipopago();
        this.verpago=1;
    }
    
    volveraproductos(){
        this.ventas.id_moneda=0;
        this.tabs=document.getElementById('tabini');
        this.tabs.click();
        this.verpago=null;
        
    }
    limpiar(){
        this.limpiarcodigo_productos();
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
            this.inicio.push({
                id:this.detalleventas.length+1,
                descripcion:"",
                precio_unitario:"",
                cantidad:"",});
        }
        while(i<this.impuestos.length){
            this.impuestos.splice(0,1);
        }
        this.ventas=new VentasModel(null,null,null,null,this.id_caja,null,null,null,null,null,this.user.id,0,null,null,null,0,null,null,null,null,null,null,null,null,null,null);
    }


    agregarunidadpro(indice,arreglo){
        console.log(arreglo);
        let i=0;
        let j=0;
        let k=0;
        let n=0;
        let si=0;
        let sci=0;

        let stotal=0;
        let validar=false;
        if(arreglo.cantidad>=arreglo.cantidad_maxima){
            while(si<this.productos.length){
                if(this.productos[si].id===arreglo.id_producto && this.productos[si].id_codigo!=arreglo.id_codigo_producto){
                    
                    if(this.productos[si].cantidad==null){
                        while(sci<this.codigo_productos.length){
                            if(this.codigo_productos[sci].id_detalle_pago==this.productos[si].id){
                                if(this.codigo_productos[sci].cantidad<this.codigo_productos[sci].cantidad_maxima){
                                    console.log('entro')
                                    this.codigo_productos[sci].cantidad++;
                                    validar=true;
                                    break;
                                }
                            }
                            sci++
                        }
                        if(validar==true){
                            break;
                        }
                    }else{
                        
                        this.cod_pro.id_detalle_pago=this.productos[si].id;
                        this.cod_pro.id_codigo_producto=this.productos[si].id_codigo;
                        this.cod_pro.cantidad=this.productos[si].cantidad;
                        this.cod_pro.cantidad_maxima=this.productos[si].stock;
                        this.cod_pro.serie=this.productos[si].numero_de_serie;
                        this.codigo_productos.push(this.cod_pro);
                        this.cod_pro=new codigoProductosModel(null,null,null,null,null,null);
                        this.productos[si].cantidad=null;
                        validar=true;
                        break;
                    }
                }
                sci=0;
                si++;
            }
            
        }else{
            while(sci<this.codigo_productos.length){
                if(this.codigo_productos[sci].cantidad<this.codigo_productos[sci].cantidad_maxima){
                    console.log('entro')
                    this.codigo_productos[sci].cantidad++;
                    break;
                }
                sci++
            }
            validar=true;
        }


        while(i<this.productos.length){
            if(this.productos[i].id===arreglo.id_producto && this.productos[i].id_codigo===arreglo.id_codigo_producto){
                if(validar==false){
                    this.toaste.errorAlerta('Ya no ay mas '+arreglo.descripcion+' en stock','Error!!!!');
                }else{
                    arreglo.descuento_cant+=(arreglo.descuento_cant/arreglo.cantidad);
                    arreglo.cantidad=(arreglo.cantidad*1)+1;
                    if(this.boleta==true){
                        this.ventas.total=this.ventas.total+(parseFloat(arreglo.precio_unitario)-arreglo.descuento_cant/arreglo.cantidad);
                        this.total=this.ventas.total;
                    }else{
                        while(j<this.productos[i].preg.length){
                            console.log(this.productos[i].preg[j].nombre);
                            if(this.productos[i].preg[j].tipo.toUpperCase()==="IGV"){
                                if(this.productos[i].preg[j].nombre.toUpperCase()==="GRAVADOS"){
                                    this.ventas.total+=((arreglo.precio_unitario-(arreglo.descuento_cant/arreglo.cantidad))/(1+this.productos[i].preg[j].porcentaje/100));
                                    while(k<this.impuestos.length){
                                        if(this.impuestos[k].nombre==="IGV"){
                                            n=(((arreglo.precio_unitario-(arreglo.descuento_cant/arreglo.cantidad))/(1+this.productos[i].preg[j].porcentaje/100))*this.productos[i].preg[j].porcentaje/100);
                                            this.impuestos[k].cantidad+=(n);
                                        }
                                        k++;
                                    }
                                }else{
                                    while(k<this.impuestos.length){
                                        if(this.impuestos[k].nombre===this.productos[i].preg[j].nombre){
                                            this.impuestos[k].cantidad+=parseFloat(arreglo.precio_unitario)-(arreglo.descuento_cant/arreglo.cantidad);
                                        }
                                        k++;
                                    } 
                                }
                            k=0;
                            }else{
                                while(k<this.impuestos.length){
                                    if(this.impuestos[k].nombre===this.productos[i].preg[j].nombre){
                                        this.impuestos[k].cantidad+=(parseFloat(arreglo.precio_unitario)-(arreglo.descuento_cant/arreglo.cantidad))*this.productos[i].preg[j].porcentaje/100;
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
                j=0;
            }
            i++
            this.sumartotal();
        }
        this.letrado=this.conversor.NumeroALetras(Math.round( this.total *100)/100);
        console.log(this.codigo_productos);
    }

    quitarunidadpro(indice,arreglo){
        let i=0;
        let j=0;
        let k=0;
        let n=0;
        let si=0
        let icod=this.codigo_productos.length-1;
        let stotal=0;
        let validar=false;
        while(icod>=0){
            if(this.codigo_productos[icod].id_detalle_pago==arreglo.id_producto){
                while(si<this.productos.length){
                    if(this.productos[si].id_codigo==this.codigo_productos[icod].id_codigo_producto && this.productos[si].cantidad==null){
                        if(this.codigo_productos[icod].cantidad==1){
                            this.productos[si].cantidad=1;
                            this.codigo_productos.splice(icod,1);
                            validar=true;
                            break;
                        }else{
                            this.codigo_productos[icod].cantidad-=1;
                            validar=true;
                            break;
                        }
                    }
                    si++;
                }
            }
            si=0;
            if(validar==true){
                break;
            }
            icod-=1;
        }

        while(i<this.productos.length){
            if(this.productos[i].id===arreglo.id_producto && this.productos[i].id_codigo===arreglo.id_codigo_producto){
                if(this.boleta==true){
                    this.ventas.total-=(arreglo.precio_unitario-(arreglo.descuento_cant/arreglo.cantidad));
                    this.total=this.ventas.total;
                }else{
                    while(j<this.productos[i].preg.length){
                        if(this.productos[i].preg[j].tipo==="IGV"){
                            if(this.productos[i].preg[j].nombre==="gravados"){
                                this.ventas.total-=((arreglo.precio_unitario-(arreglo.descuento_cant/arreglo.cantidad))/(1+this.productos[i].preg[j].porcentaje/100));
                                while(k<this.impuestos.length){
                                    if(this.impuestos[k].nombre==="IGV"){
                                        this.impuestos[k].cantidad-=((arreglo.precio_unitario-(arreglo.descuento_cant/arreglo.cantidad))/(1+this.productos[i].preg[j].porcentaje/100)*this.productos[i].preg[j].porcentaje/100);
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
                                            this.impuestos[k].cantidad-=((arreglo.precio_unitario)-(arreglo.descuento_cant/arreglo.cantidad));
                                        
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
                                    this.impuestos[k].cantidad-=((arreglo.precio_unitario-(arreglo.descuento_cant/arreglo.cantidad))*this.productos[i].preg[j].porcentaje/100);
                                    
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
                if(arreglo.cantidad===1){
                    this.productos[i].cantidad=1;  
                }
                
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
            arreglo.descuento_cant-=arreglo.descuento_cant/arreglo.cantidad;
            arreglo.cantidad=arreglo.cantidad-1;
        }
        this.letrado=this.conversor.NumeroALetras(Math.round( this.total *100)/100);
        console.log(this.codigo_productos);
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
    seleccionarcliente(id,nombre,doc,nrodoc,email,direc){
        this.idcliente=id;
        this.clientselec=id;
        this.namescli=nombre+' - '+doc+' : '+nrodoc;
        this.namescli=this.namescli.toUpperCase();
        this.acepclient=1;
        this.ventas.direccion=direc;
        this.ventas.nombre_cliente=nombre;
        this.ventas.nro_documento=nrodoc;
        this.ventas.email=email;
        this.ventas.tipo_documento_cliente=doc.toLowerCase();
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
        
        console.log(this.DetalleCaja);
        this.id_caja=id;
    }
    volveralascajas(){
        this.DetalleCaja=new DetalleCaja(null,null,null,null,null,null,null,null,null,null);
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
        this.DetalleCaja.monto_apertura="";
       
        if(this.arreglocantidad.c10>0){
            this.DetalleCaja.monto_apertura+="c10|"+this.arreglocantidad.c10+"|";
        }
        if(this.arreglocantidad.c20>0){
            this.DetalleCaja.monto_apertura+="c20|"+this.arreglocantidad.c20+"|";
        }
        if(this.arreglocantidad.c50>0){
            this.DetalleCaja.monto_apertura+="c50|"+this.arreglocantidad.c50+"|";
        }
        if(this.arreglocantidad.m01>0){
            this.DetalleCaja.monto_apertura+="m01|"+this.arreglocantidad.m01+"|";
        }
        if(this.arreglocantidad.m02>0){
            this.DetalleCaja.monto_apertura+="m02|"+this.arreglocantidad.m02+"|";
        }
        if(this.arreglocantidad.m05>0){
            this.DetalleCaja.monto_apertura+="m05|"+this.arreglocantidad.m05+"|";
        }
        if(this.arreglocantidad.b10>0){
            this.DetalleCaja.monto_apertura+="b10|"+this.arreglocantidad.b10+"|";
        }
        if(this.arreglocantidad.b20>0){
            this.DetalleCaja.monto_apertura+="b20|"+this.arreglocantidad.b20+"|";
        }
        if(this.arreglocantidad.b50>0){
            this.DetalleCaja.monto_apertura+="b50|"+this.arreglocantidad.b50+"|";
        }
        if(this.arreglocantidad.c01>0){
            this.DetalleCaja.monto_apertura+="c01|"+this.arreglocantidad.c01+"|";
        }
        if(this.arreglocantidad.c02>0){
            this.DetalleCaja.monto_apertura+="c02|"+this.arreglocantidad.c02+"|";
        }
        console.log(this.DetalleCaja.monto_apertura);
        
        this.mostarproductos();
    }
    mandarmontocierre(){
        this.DetalleCaja.monto_cierre_efectivo="";
       
        if(this.arreglocantidad.c10>0){
            this.DetalleCaja.monto_cierre_efectivo+="c10|"+this.arreglocantidad.c10+"|";
        }
        if(this.arreglocantidad.c20>0){
            this.DetalleCaja.monto_cierre_efectivo+="c20|"+this.arreglocantidad.c20+"|";
        }
        if(this.arreglocantidad.c50>0){
            this.DetalleCaja.monto_cierre_efectivo+="c50|"+this.arreglocantidad.c50+"|";
        }
        if(this.arreglocantidad.m01>0){
            this.DetalleCaja.monto_cierre_efectivo+="m01|"+this.arreglocantidad.m01+"|";
        }
        if(this.arreglocantidad.m02>0){
            this.DetalleCaja.monto_cierre_efectivo+="m02|"+this.arreglocantidad.m02+"|";
        }
        if(this.arreglocantidad.m05>0){
            this.DetalleCaja.monto_cierre_efectivo+="m05|"+this.arreglocantidad.m05+"|";
        }
        if(this.arreglocantidad.b10>0){
            this.DetalleCaja.monto_cierre_efectivo+="b10|"+this.arreglocantidad.b10+"|";
        }
        if(this.arreglocantidad.b20>0){
            this.DetalleCaja.monto_cierre_efectivo+="b20|"+this.arreglocantidad.b20+"|";
        }
        if(this.arreglocantidad.b50>0){
            this.DetalleCaja.monto_cierre_efectivo+="b50|"+this.arreglocantidad.b50+"|";
        }
        if(this.arreglocantidad.c01>0){
            this.DetalleCaja.monto_cierre_efectivo+="c01|"+this.arreglocantidad.c01+"|";
        }
        if(this.arreglocantidad.c02>0){
            this.DetalleCaja.monto_cierre_efectivo+="c02|"+this.arreglocantidad.c02+"|";
        }
        console.log(this.DetalleCaja.monto_cierre_efectivo);
        this.cierredecaja();
    }
    cierredecaja(){
        this._DetalleCajasService.CierreCaja(this.DetalleCaja).subscribe(
            res=>{
                console.log(res);
                if(res.code==200){
                    this.limpiar();
                    this.DetalleCaja=new DetalleCaja(null,null,null,null,null,null,null,null,null,null);
                    this.sumamonedas=0;
                    this.arreglocantidad=new CantidadMOdel(0,0,0,0,0,0,0,0,0,0,0);
                    this.apertura=null;
                    this.detruirtcajas();
                    this.detruirtclient();
                    this.limpiarproductos();
                    this.obtenercajas();
                }
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    limpiarproductos(){
        let i=0;
        while(i<this.productos.length){
            this.productos.splice(0,1)
        }
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
    ponermonedaenelimput(n){
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
        
        this._DetalleCajasService.AperturaCaja(this.DetalleCaja).subscribe(
            res=>{
                if(res.code==200){
                    this.traerproductos();
                    this.sumamonedas=0;
                    this.arreglocantidad=new CantidadMOdel(0,0,0,0,0,0,0,0,0,0,0);
                }
                console.log(res);
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    traerproductos(){
        this.apertura=1;
        let indice=0;
        this._AlmaceneService.SeleccionarAlmacenporcaja(this.id_caja).subscribe(
            res=>{
               this.ventas.id_caja=this.DetalleCaja.id_caja;
               
               while(indice<res.length){
                   this.pro=res[indice];
                   this.productos.push({
                    id_codigo:res[indice].id_codigo,
                    numero_de_serie:res[indice].numero_de_serie,
                    codigo_interno:res[indice].codigo_interno,
                    fecha_vencimiento:res[indice].fecha_vencimiento,
                    id:res[indice].id,
                    imagen:res[indice].imagen,
                    nombre_producto:res[indice].nombre_producto,
                    descripcion:res[indice].descripcion,
                    abreviacion:res[indice].abreviacion,
                    nombre:res[indice].nombre,
                    precio_venta:res[indice].precio_venta,
                    stock:res[indice].stock,
                    codigo:res[indice].codigo,
                    id_detalle_almacen:res[indice].id_detalle_almacen,
                    cantidad:1,
                    descuento_maximo:res[indice].descuento_maximo,
                    preg:[]});
                    this.mostrarimpuestosdeproductos(res[indice].id,indice);
                   indice=indice+1;
               }
               this.tablacajas();  
                console.log(this.productos);
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
                        id:res[indice].id,
                        nombre:res[indice].nombre,
                        porcentaje:res[indice].porcentaje,
                        tipo:res[indice].tipo,
                    });
                    indice=indice+1;
                }
               if(res.length===this.productos[index].preg.length){
                   this.autorizarboton++;
               }
               
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
                console.log(res);
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
        this.tablaclientes();
        this.detruirtclient();
        this.traercliente();
        
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
    alertaventa(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Guardado',
            text:'La venta se agrego correctamente',
            buttons: true,
            timer: 1500
          })
        this.router.navigate(['/'+this.user.rol+'/imprimir/venta']);
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