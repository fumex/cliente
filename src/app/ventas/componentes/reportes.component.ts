import { Component,ViewContainerRef } from "@angular/core";
import { CajasModels } from "../../cajas/modelos/cajas";
import { CajasService } from '../../cajas/services/cajas.services';
import { DetalleCajasUsuarioService } from '../../cajas/services/detalle.cajas.usuarios.services';
import {VentasService} from '../services/Ventas.service';
import { User } from "../../auth/interfaces/user.model";
import { AuthService } from "../../auth/services/auth.service";
import {SucursalService} from '../../sucursales/services/sucursal.service';
import {DettaleUsuarioService} from '../../usuarios/services/DetalleUsuario.service';
import {SucursalModel} from '../../sucursales/modelos/sucursal';
import {UsuarioModel} from '../../usuarios/modelos/usuarios';
import {ToastService} from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {DetalleCaja} from '../modelos/detalle_cajas'
import {DetalleVentasModel} from '../../ventas/modelos/detalle_ventas';
import {DetalleVentasService} from '../services/DetalleVentas.service'
import { VentasModel } from "../modelos/ventas";
import {UsuarioService} from '../../usuarios/services/usuarios.service';
import { environment } from "../../../environments/environment";
import {conversordenumerosaletras} from '../services/numeroaletras.service';
import {ImpuestoService} from '../../impuesto/services/impuesto.service'

declare var jQuery:any;
declare var $:any;
declare var swal:any; 

@Component({
    selector:'cajasabiertas',
    templateUrl:'../views/reportes.html',
    providers:[CajasService,ToastService,SucursalService,DetalleVentasService,conversordenumerosaletras]
})
export class ReportesComponent{
    public fecha;
    public user:any;
    public titulo;
    public modal;
    public modal2;
    public year=null;
    public mes=null;
    public nombremes=null;
    public dia=null;
    public matriz=new Array(6);
    public matrizmeses=new Array(12);
    public meses;
    public primerdia;
    public ultimodia;
    public cantidadcambiomes=0;
    public ventas:Array<VentasModel>=[];
    public vervpd=null;
    public vervpa=null;
    public verda=null;
    public vercajas=null;
    public verhomes=null;
    public diaactual=null;
    public nombredia=null
    public matrizdia=new Array(7);
    public detalleventas:DetalleVentasModel;
    public getventa:VentasModel;
    public sucursalesycajas:Array<any>=[];
    public detcaja:DetalleCaja;
    public detallecajas:Array<DetalleCaja>=[];
    public mostarventas:Array<any>=[];
    public usuariosventas:Array<any>=[];
    public ventassinfiltro:Array<any>=[];
    public url=environment.api_url+'/imagenes'; 

    public vermenuusu=null;

    public productos:Array<any>=[];
    public ventasproductos:Array<any>=[];
    public detalleproductos:Array<any>=[];
    public totalproductos:Array<any>=[];
    public nombreproducto;
    public getpventas:Array<any>=[];
    public impuestos:Array<any>=[];
    public nombreserie=null;
    public letrado=null;
    public fechaventa=null;
    public getimpuestos:Array<any>=[];
    public total=0;
    public subtotal=0;
    constructor(
        private _cajasservice:CajasService,
        private _SucursalService:SucursalService,
        private _DettaleUsuarioService:DettaleUsuarioService,
        public _DetalleCajasUsuarioService:DetalleCajasUsuarioService,
        private _DetalleVentasService:DetalleVentasService,
        private conversor:conversordenumerosaletras,
        private _VentasService:VentasService,
        private _UsuarioService:UsuarioService,
        private _ImpuestoService:ImpuestoService,
        private auth:AuthService,
        private toaste:ToastService,
        public toastr: ToastsManager,
        vcr: ViewContainerRef
    ){
        this.titulo="Reportes"
        this.toastr.setRootViewContainerRef(vcr);
        //this.tablaventas();
        this.user=this.auth.getUser();
    }
    ngOnInit(){
        this.detcaja=new DetalleCaja(null,null,null,null,null,null,null,null,null,null)
        this.getventa=new VentasModel(null,null,null,null,null,null,null,null,null,null,this.user.id,null,null,null,null,0,null,null,null,null,null,null,null,null,null,null);
        this.modal=document.getElementById('myModal');
        this.modal2=document.getElementById('myModal2');
        window.onclick = function(event) {
            if (event.target == this.document.getElementById('myModal') || event.target == this.document.getElementById('myModal2')) {
                this.document.getElementById('myModal').style.display = "none";
                this.document.getElementById('myModal2').style.display = "none";
            }
        }
        var f=new Date();
        this.dia=f.getDate();
        this.mes=f.getMonth();
        this.year=f.getFullYear();
        this.getsucursales();
        this.matrizdia=["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"]
        this.matrizmeses[0]=["Enero",31];
        if(this.mes==1 &&  this.year%4==0){
            this.matrizmeses[1]=["febrero",29];
        }else{
            this.matrizmeses[1]=["febrero",28];
        }
       
        this.matrizmeses[2]=["marzo",31];
        this.matrizmeses[3]=["abril",30];
        this.matrizmeses[4]=["mayo",31];
        this.matrizmeses[5]=["junio",30];
        this.matrizmeses[6]=["julio",31];
        this.matrizmeses[7]=["agosto",31];
        this.matrizmeses[8]=["setiembre",30];
        this.matrizmeses[9]=["octubre",31];
        this.matrizmeses[10]=["noviembre",30];
        this.matrizmeses[11]=["diciembre",31];

        this.meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
        console.log(f.getDay() + ", " + f.getDate() + " de " + f.getMonth()+ " de " + f.getFullYear());
        
        this.nombremes=this.meses[this.mes];
        this.calendario(f.getDay(),f.getDate(),f.getMonth(),f.getFullYear());
    }
    volverusu(){
        this.vervpd=null;
        this.vermenuusu=1;
        this.destruirtablaventas();
    }
    verproductos(){
        let i=0,j=0,validado=null;
        
        this._VentasService.getproductosvendidos(this.fecha,this.user.id).subscribe(
            res=>{
                console.log(res)
                this.totalproductos=res;
                while(i<res.length){
                    if(this.productos.length>0){
                        while(j<this.productos.length){
                            if(res[i].nombre_producto==this.productos[j].nombre_producto){
                                validado=j;
                            }
                            j++;
                        }

                        if(validado!=null){
                            this.productos[validado].cantidad+=res[i].cantidad;
                        }else{
                            this.productos.push({
                                nombre_producto:res[i].nombre_producto,
                                nombre_categoria:res[i].nombre_categoria,
                                unidad:res[i].unidad,
                                descripcion:res[i].descripcion,
                                cantidad:res[i].cantidad
                            })
                        }
                    }else{
                        this.productos.push({
                            nombre_producto:res[i].nombre_producto,
                            nombre_categoria:res[i].nombre_categoria,
                            unidad:res[i].unidad,
                            descripcion:res[i].descripcion,
                            cantidad:res[i].cantidad
                        })
                    }
                    j=0;
                    i++;
                }
                this.tablaproductos();
                console.log(this.productos)
                console.log(this.totalproductos);
            },
            err=>{
                console.log(<any>err)
            }
        )
        

    }
    traerimpuestos(){
        this._ImpuestoService.getImpuestos().subscribe(
            res=>{
                this.getimpuestos=res;
                console.log(this.getimpuestos)
            },
            err=>{
                console.log(<any>err);
            }
        )
    }
    verdetalleproductos(array){
        let i=0,j=0,k=0,validar=null,valortot=0;
        this._ImpuestoService.getImpuestos().subscribe(
            res=>{
                this.getimpuestos=res;
                console.log(this.getimpuestos)
                if(array.serie.charAt(0)=="B"){
                    this.nombreserie="BOLETA"
                }else{
                    this.nombreserie="FACTURA"
                }
                console.log(array);
                this.letrado=this.conversor.NumeroALetras(parseFloat(array.total));
                this.fechaventa=array.fecha.charAt(8)+array.fecha.charAt(9)+' de '+this.matrizmeses[parseInt(array.fecha.charAt(5)+array.fecha.charAt(6))][0]+' del ' +
            
                array.fecha.slice(0,-15);
                while(i<this.totalproductos.length){
                    if(this.totalproductos[i].serie_venta==array.serie){
                    
                        valortot=parseFloat(this.totalproductos[i].precio_unitario)*parseFloat(this.totalproductos[i].cantidad);
                        if(this.totalproductos[i].igv_id > 0 ){
                                
                            while(j<this.getimpuestos.length){
                                if(this.getimpuestos[j].id==this.totalproductos[i].igv_id){
                                    console.log('entro');
                                    if(this.getimpuestos[j].nombre.toUpperCase()=="GRAVADOS"){
                                        
                                        while(k<this.impuestos.length){
                                            if(this.impuestos[j].nombre.toUpperCase()=="IGV"){
                                                validar=k;
                                            }
                                            k++
                                        }
                                        k=0;
                                        valortot=(parseFloat(this.totalproductos[i].precio_unitario)*parseFloat(this.totalproductos[i].cantidad))/(1+parseFloat(this.totalproductos[i].igv)/100);
                                        this.subtotal+=valortot;
                                        console.log(this.subtotal);
                                        if(validar!=null){
                                            this.impuestos[validar].total+=((parseFloat(this.totalproductos[i].precio_unitario)*parseFloat(this.totalproductos[i].cantidad))/(1+parseFloat(this.totalproductos[i].igv)/100))*(this.totalproductos[i].igv/100)
                                        }else{
                                            this.impuestos.push({
                                                nombre:"IGV",
                                                impuesto:this.totalproductos[i].igv,
                                                total:(parseFloat(this.totalproductos[i].precio_unitario)*parseFloat(this.totalproductos[i].cantidad))
                                            })
                                        }
                                        validar=null;
                                    }else{
                                        while(k<this.impuestos.length){
                                            if(this.impuestos[j].nombre==this.getimpuestos[j].nombre){
                                                validar=k;
                                            }
                                            k++
                                        }
                                        k=0;
                                        
                                        if(validar!=null){
                                            this.impuestos[validar].total+=parseFloat(this.totalproductos[i].precio_unitario)*parseFloat(this.totalproductos[i].cantidad)
                                        }else{
                                            this.impuestos.push({
                                                nombre:this.getimpuestos[j].nombre,
                                                impuesto:this.totalproductos[i].igv,
                                                total:parseFloat(this.totalproductos[i].precio_unitario)*parseFloat(this.totalproductos[i].cantidad)
                                            })
                                        }
                                        validar=null;
                                    }
                                
                                }
                                j++;
                            }
                            j=0;
                        
                        }
                        if(this.totalproductos[i].isc_id > 0 ){
                            while(j<this.getimpuestos.length){
                                if(this.getimpuestos[j].id==this.totalproductos[i].isc_id){
                                    while(k<this.impuestos.length){
                                        if(this.impuestos[j].nombre==this.getimpuestos[j].nombre){
                                            validar=k;
                                        }
                                            k++
                                    }
                                    k=0;
                                    this.subtotal+=parseFloat(this.totalproductos[i].precio_unitario)*parseFloat(this.totalproductos[i].cantidad)
                                    if(validar!=null){
                                        this.impuestos[validar].total+=(parseFloat(this.totalproductos[i].precio_unitario)*parseFloat(this.totalproductos[i].cantidad))*(parseFloat(this.totalproductos[i].isc)/100);
                                    }else{
                                        this.impuestos.push({
                                            nombre:this.getimpuestos[j].nombre,
                                            impuesto:this.totalproductos[i].isc,
                                            total:(parseFloat(this.totalproductos[i].precio_unitario)*parseFloat(this.totalproductos[i].cantidad))*(parseFloat(this.totalproductos[i].isc)/100),
                                        })
                                    }
                                    validar=null;
                                }
                                j++;
                            }
                            j=0;
                        
                        }
                        if(this.totalproductos[i].otro_id > 0 ){
                            while(j<this.getimpuestos.length){
                                if(this.getimpuestos[j].id==this.totalproductos[i].otro_id  ){
                                    while(k<this.impuestos.length){
                                        if(this.impuestos[j].nombre==this.getimpuestos[j].nombre){
                                            validar=k;
                                        }
                                            k++
                                    }
                                    k=0;
                                    this.subtotal+=parseFloat(this.totalproductos[i].precio_unitario)*parseFloat(this.totalproductos[i].cantidad)
                                    if(validar!=null){
                                        this.impuestos[validar].total+=(parseFloat(this.totalproductos[i].precio_unitario)*parseFloat(this.totalproductos[i].cantidad))*(parseFloat(this.totalproductos[i].isc)/100);
                                    }else{
                                        this.impuestos.push({
                                            nombre:this.getimpuestos[j].nombre,
                                            impuesto:this.totalproductos[i].isc,
                                            total:(parseFloat(this.totalproductos[i].precio_unitario)*parseFloat(this.totalproductos[i].cantidad))*(parseFloat(this.totalproductos[i].isc)/100),
                                        })
                                    }
                                    validar=null;
                                }
                                j++;
                            }
                            j=0;
                        
                        }
                        this.detalleproductos.push({
                            nombre:this.totalproductos[i].nombre_producto,
                            descuento:this.totalproductos[i].descuento,
                            precio_unitario:this.totalproductos[i].precio_unitario,
                            cantidad:this.totalproductos[i].cantidad,
                            valor_venta:valortot,

                        }) 
                    }
                    i++;
                }
                this.sumartotall();
                console.log(this.detalleproductos)
                console.log(this.letrado)
                this.getpventas.push(array);
                console.log(this.getpventas)
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    sumartotall(){
        let i=0;
        this.total=this.subtotal;
        while(i<this.impuestos.length){
            this.total+=this.impuestos[i].total;
            i++;
        }

    }
    filtarporusuario(id){
        this.vervpd=1;
        this.vermenuusu=null;
        let i=0;
        let j=0;
        while(0<this.ventas.length){
            this.ventas.splice(0,1);
        }
        this._VentasService.getventaporusuario(this.fecha,id).subscribe(
            res=>{
                this.destruirtablaventas();
                console.log(res);
                while(i<res.length){
                    res[i].pago_efectivo=parseFloat(res[i].pago_tarjeta)+parseFloat(res[i].pago_efectivo);
                    this.ventassinfiltro.push(res[i]);
                    this.ventas.push(res[i]);
                    i++;
                }
                this.reconstruirtablaventas();
            },
            err=>{
                console.log(<any>err);
            }
        );
        
    }
    
    getsucursales(){
        let i=0;
        let j=0;
        let id=0;
        let ver=null;
        this._cajasservice.getcajaysucrsalporusuario(this.user.id).subscribe(
            res=>{
               console.log(res);
                while(i<res.length){
                    
                    while(j<this.sucursalesycajas.length){
                        console.log(res[i].nombre_sucursal,'-',this.sucursalesycajas[j].sucursal)
                        if(res[i].nombre_sucursal==this.sucursalesycajas[j].sucursal){
                            ver=j;
                        }
                        j++;
                    }
                    console.log(ver);
                    if(ver!=null){
                        this.sucursalesycajas[ver].caja.push({
                            id:res[i].id,
                            nombre:res[i].nombre,
                            descripcion:res[i].descripcion
                        });
                    }else{
                        
                        this.sucursalesycajas.push({
                            id_suc:id,
                            sucursal:res[i].nombre_sucursal,
                            direccion:res[i].direccion,
                            caja:[]
                        })
                        this.sucursalesycajas[this.sucursalesycajas.length-1].caja.push({
                            id:res[i].id,
                            nombre:res[i].nombre,
                            descripcion:res[i].descripcion
                        })

                        id+=1; 

                    }
                    
                    ver=null;
                    j=0;
                    i++;
                }
                console.log(this.sucursalesycajas);
               
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    mostrarcajas(id){
        this.vercajas=id;
    }
    ocultarcajas(){
        this.vercajas=null;
    }
    verhome(){
        
        if(this.verhomes==1){
            this.verhomes=null;
        }else{
            this.verhomes=1;
        }
    }
    verventasporcaja(id){
        let i=0;
        console.log(id);
        this.limpiarventas();
        this.vervpa=id;
        this.verda=null;
        this._cajasservice.getventas(id).subscribe(
            res=>{
                console.log(res);
                while(i<res.length){
                    res[i].pago_efectivo=parseInt(res[i].pago_efectivo);
                    res[i].pago_tarjeta=parseInt(res[i].pago_tarjeta);
                    this.ventas.push(res[i]);
                    i++;
                }
               
            },
            err=>{
                console.log(<any>err)
            }
        );
        this.destruirtablaventas();
        this.reconstruirtablaventas();
    }
    cambio(){
        this.vervpd=null;
        this.verda=null;
        this.vercajas=null;
        this.vermenuusu=null;
        this.limpiarventas();   
        this.limpiarproductos();
        this.destruirtabladcajas();
        this.destruirtablaventas();
    }
    limpiarproductos(){
        while(0<this.productos.length){
            this.productos.splice(0,1);
        }
    }
    limpiarventas(){
        while(0<this.ventas.length){
            this.ventas.splice(0,1);
        }
        while(0<this.ventassinfiltro.length){
            this.ventassinfiltro.splice(0,1);
        }
    }
    volvera_d_cajas(){
        this.verda=1;
        this.vervpa=null;
        this.tabladetallecajas();
    }
    verdetallecajas(id){
        let i=0;
        this.verda=id;
        this._cajasservice.getdetallecaja(id).subscribe(
            res=>{
                while(i<res.length){
                    res[i].monto_apertura=this.pasaranumero(res[i].monto_apertura);
                    res[i].monto_cierre_efectivo=this.pasaranumero(res[i].monto_cierre_efectivo);
                    res[i].monto_cierre_tarjeta=parseInt(res[i].monto_cierre_tarjeta);
                    if(res[i].monto_actual==null){
                        res[i].monto_actual=0;
                    }
                    
                    
                    i++;
                }
                this.detallecajas=res;
                console.log(this.detallecajas);
            },
            err=>{
                console.log(<any>err);
            }
        );
        this.destruirtabladcajas();
        this.tabladetallecajas();
    }
    traerusuariosporsucursal(){
        let i=0,j=0,k=0,ver=0;
        this._UsuarioService.getuserssucursals(this.user.id).subscribe(
            res=>{
                while(i<res.length){
                    while(j<res[i].length){
                        if(this.usuariosventas.length>0){
                            while(k <this.usuariosventas.length){
                                if(this.usuariosventas[k].id==res[i][j].id){
                                    ver++
                                }
                               
                                k++;
                            }
                            if(ver<1){
                                this.usuariosventas.push(res[i][j])
                            }
                            ver=0;
                            k=0;
                        }else{
                            this.usuariosventas.push(res[i][j])
                        }
                        
                        j++
                    }
                    j=0;
                    i++;
                }
                console.log(this.usuariosventas);
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    pasaranumero(palabra){
        let grupnum=0;
        let gruplet="";
        let total=0;
        let i=0;
        if(palabra!=null){
            var arreglopalabra = palabra.split("|");
            while(i<arreglopalabra.length){
                if(i+1!=arreglopalabra.length){
                    if(i%2==0){
                        gruplet=arreglopalabra[i];
                        switch (gruplet) {
                            case "c10":
                                total+=parseInt(arreglopalabra[i+1])*0.1;
                                break;
                            case "c20":
                                total+=parseInt(arreglopalabra[i+1])*0.2;
                            
                                break;
                            case "c50":
                                total+=parseInt(arreglopalabra[i+1])*0.5;
                                break;
                            case "m01":
                                total+=parseInt(arreglopalabra[i+1])*1;
                                break;
                            case "m02":
                                total+=parseInt(arreglopalabra[i+1])*2;
                                break;
                            case "m05":
                                total+=parseInt(arreglopalabra[i+1])*5;
                                break;
                            case "b10":
                                total+=parseInt(arreglopalabra[i+1])*10;
                                break;
                            case "b20":
                                total+=parseInt(arreglopalabra[i+1])*20
                                break;
                            case "b50":
                                total+=parseInt(arreglopalabra[i+1])*50;
                                break;
                            case "c01":
                                total+=parseInt(arreglopalabra[i+1])*100;
                                break;
                            case "c02":
                                total+=parseInt(arreglopalabra[i+1])*200;
                                break;
                        }
                    }
                }
                i++;
            }
        }
        console.log(total)  
        return total;
    }
    calendario(dia,dias,mes,year){
        let i,j,k=0;

        for (i = 0; i < 6; i++){
            this.matriz[i]=new Array(7);
        }
        
        i=0;
        let resto=dias%7;
        
        this.primerdia=((dia+8)-resto)%7;
        this.ultimodia=(this.primerdia+this.matrizmeses[mes][1])%7;
        
        console.log(this.ultimodia);

        while(i<7){
            while(j<7){
                k++;
                if(k>this.primerdia && k-this.primerdia<=this.matrizmeses[mes][1]){
                    this.matriz[i-1][j]=k-this.primerdia;
                }
                j++;
            }
            j=0;
            i++;
        }
        this.ultimodia=(this.primerdia+this.matrizmeses[mes][1])%7;
        console.log(this.matriz);
        
    }
    retrocedermes(){
        this.cantidadcambiomes+=1;
        var f=new Date();
        if(this.mes<1){
            this.mes=11;
            this.year-=1;
            if(this.year%4==0){
                this.matrizmeses[1][1]=29;
            }else{
                this.matrizmeses[1][1]=28;
            }
        }else{
            this.mes-=1;
        }
        this.nombremes=this.meses[this.mes];
        this.dia=this.matrizmeses[this.mes][1]+1;
        
        this.calendario(this.primerdia-1,this.matrizmeses[this.mes][1],this.mes,this.year);
    }
    avanzarmes(){
        this.cantidadcambiomes-=1;
        var f=new Date();
        if(this.mes>10){
            this.mes=0;
            this.year+=1;
            if(this.year%4==0){
                this.matrizmeses[1][1]=29;
            }else{
                this.matrizmeses[1][1]=28;
            }
        }else{
            this.mes+=1;
        }
        if(this.year==f.getFullYear() && this.mes==f.getMonth()){
            this.dia=f.getDate();
        }else{
            this.dia=this.matrizmeses[this.mes][1]+1;
        }
        this.nombremes=this.meses[this.mes];
        
        
        this.calendario(this.ultimodia+this.matrizmeses[this.mes][1]-1,this.matrizmeses[this.mes][1],this.mes,this.year);
    }
    
    getventasfecha(dia){
        
        this.traerusuariosporsucursal();
        let i=0;
        this.nombredia=this.matrizdia[(this.primerdia+dia-1)%7];
        this.diaactual=dia;
        //this.vervpd=1;
        this.vermenuusu=1;
        let nmes=null;
        let ndia=null;
        if(this.mes+1>9){
            nmes=this.mes+1;
        }else{
            nmes="0"+parseInt(this.mes+1);
        }
        if(this.dia+1>9){
            ndia=this.mes+1;
        }else{
            ndia="0"+parseInt(this.dia+1);
        }
        this.fecha=this.year+'-'+nmes+'-'+dia;
        this.verproductos();
        this._VentasService.getventasfecha(this.fecha,this.user.id).subscribe(
            res=>{
                
                while(i<res.length){
                    res[i].pago_efectivo=parseFloat(res[i].pago_tarjeta)+parseFloat(res[i].pago_efectivo);
                    this.ventassinfiltro.push(res[i]);
                    this.ventas.push(res[i]);
                    i++;
                }
                
                console.log(this.ventas);
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    mostrardetalleventas(arregloventa){
        this.modal.style.display = "block";
        this.getdetalleventas(arregloventa.id);
        this.getventa=arregloventa;
        console.log(this.getventa);
    }
    mostrarventasdeproducto(nombre){
        let i=0;
        this.nombreproducto=nombre;
        this.limpiarventasproductos();
        this.modal2.style.display = "block";
        while(i<this.totalproductos.length){
            if(this.totalproductos[i].nombre_producto==nombre){
                this.ventasproductos.push({
                    fecha:this.totalproductos[i].created_at,
                    serie:this.totalproductos[i].serie_venta,
                    caja:this.totalproductos[i].nombre_caja,
                    total:this.totalproductos[i].total,
                    total_recivido:parseFloat(this.totalproductos[i].pago_efectivo)+parseFloat(this.totalproductos[i].pago_tarjeta),
                    vuelto:(parseFloat(this.totalproductos[i].pago_efectivo)+parseFloat(this.totalproductos[i].pago_tarjeta))-parseFloat(this.totalproductos[i].total),
                    numero_doc:this.totalproductos[i].nro_documento,
                    direccion:this.totalproductos[i].direccion,
                    cliente:this.totalproductos[i].nombre_cliente
                })
            }
            i++;
        }
        

        console.log(nombre)
    }
    limpiarventasproductos(){
        while(0<this.ventasproductos.length){
            this.ventasproductos.splice(0,1);
        }
    }
    limpiardetalleproductos(){
        while(0<this.detalleproductos.length){
            this.detalleproductos.splice(0,1)
        }
    }
    cerrarmodal(){
        this.modal.style.display = "none";
        this.modal2.style.display = "none";
    }
    getdetalleventas(id){
        let i=0;
        this._DetalleVentasService.getdetalleventas(id).subscribe(
            res=>{
                this.detalleventas=res;
                while(i<res.length){
                    this.detalleventas[i].id=(parseFloat(res[i].precio_unitario)/(1+parseFloat(res[i].igv)/100))*parseFloat(res[i].igv)/100;
                    this.detalleventas[i].id_producto=(parseFloat(res[i].precio_unitario)*parseFloat(res[i].isc))/100;
                    this.detalleventas[i].codigo=(parseFloat(res[i].precio_unitario)*parseFloat(res[i].otro))/100
                    this.detalleventas[i].precio_unitario=(parseFloat(res[i].precio_unitario)/(1+parseFloat(res[i].igv)/100));
                    this.detalleventas[i].id_venta=(this.detalleventas[i].precio_unitario+this.detalleventas[i].id+this.detalleventas[0].codigo+this.detalleventas[i].id_producto)*parseFloat(res[i].cantidad);
                    i++;
                }
                 console.log(this.detalleventas)
            },
            err=>{
                console.log(err);
            }
        );
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
            title: 'Insertado',
            text:'La Caja se agrego correctamente',
            buttons: false,
            timer: 3000
          })
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
        setTimeout(function(){
            $(function(){
                 $('#tablaventas').DataTable({
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ]
                 });
            });
        },1500);
    }
    tablaproductos(){
        setTimeout(function(){
            $(function(){
                 $('#tablaproductos').DataTable({
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ]
                 });
            });
        },1500);
    }
    tabladetallecajas(){
        //this.mostrar();
       
        setTimeout(function(){
            $(function(){
                 $('#tabladcajas').DataTable({
                    "ordering": false,
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ]
                 });
            });
        },3000);
    }
    destruirtablaproductos(){
        var table = $('#tablaproductos').DataTable();
        table .clear() ;
        $('#tablaproductos').DataTable().destroy();
    }
    destruirtabladcajas(){
        var table = $('#tabladcajas').DataTable();
        table .clear() ;
        $('#tabladcajas').DataTable().destroy();
    }
    destruirtablaventas(){	
        var table = $('#tablaventas').DataTable();
        table .clear() ;
        $('#tablaventas').DataTable().destroy();
    }
    reconstruirtablaventas(){
        this.tablaventas();
        
    }
    reconstruirtablaproductos(){
        this.tablaproductos();  
    }
    destruir(){	
        var table = $('#mytable').DataTable(); table .clear() ;
        $('#mytable').DataTable().destroy();
    }
    reconstruir(id){
        this.tabla();
    }
}