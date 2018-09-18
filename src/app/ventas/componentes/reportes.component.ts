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

declare var jQuery:any;
declare var $:any;
declare var swal:any; 

@Component({
    selector:'cajasabiertas',
    templateUrl:'../views/reportes.html',
    providers:[CajasService,ToastService,SucursalService,DetalleVentasService]
})
export class ReportesComponent{
    public user:any;
    public titulo;
    public modal;
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
    public ventas:VentasModel;
    public vervpd=null;
    public vervpa=null;
    public verda=null;
    public vercajas=null;

    public diaactual=null;
    public nombredia=null
    public matrizdia=new Array(7);
    public detalleventas:DetalleVentasModel;
    public getventa:VentasModel;
    public sucursalesycajas:Array<any>=[];
    public detcaja:DetalleCaja;
    public detallecajas:Array<DetalleCaja>=[];
    public mostarventas:Array<any>=[];
    constructor(
        private _cajasservice:CajasService,
        private _SucursalService:SucursalService,
        private _DettaleUsuarioService:DettaleUsuarioService,
        public _DetalleCajasUsuarioService:DetalleCajasUsuarioService,
        private _DetalleVentasService:DetalleVentasService,
        private _VentasService:VentasService,
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
        this.getventa=new VentasModel(null,null,null,null,null,null,null,null,null,null,this.user.id);
        this.modal=document.getElementById('myModal');
        window.onclick = function(event) {
            if (event.target == this.document.getElementById('myModal')) {
                this.document.getElementById('myModal').style.display = "none";
            }
        }
        this.getsucursales();
        this.matrizdia=["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"]
        this.matrizmeses[0]=["Enero",31];
        this.matrizmeses[1]=["febrero",28];
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
        var f=new Date();
        console.log(f.getDay() + ", " + f.getDate() + " de " + f.getMonth()+ " de " + f.getFullYear());
        this.dia=f.getDate();
        this.mes=f.getMonth();
        this.year=f.getFullYear();
        this.nombremes=this.meses[this.mes];
        this.calendario(f.getDay(),f.getDate(),f.getMonth(),f.getFullYear());
        this.modal=document.getElementById('myModal');
        window.onclick = function(event) {
            if (event.target == this.document.getElementById('myModal')) {
                this.document.getElementById('myModal').style.display = "none";
            }
        }
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
    verventasporcaja(id){
        let i=0;
        console.log(id);
        this.vervpa=id;
        this.verda=null;
        this._cajasservice.getventas(id).subscribe(
            res=>{
                console.log(res);
                while(i<res.length){
                    res[i].pago_efectivo=parseInt(res[i].pago_efectivo);
                    res[i].pago_tarjeta=parseInt(res[i].pago_tarjeta);
                    i++;
                }
                this.ventas=res;
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
        this.destruirtabladcajas();
        this.destruirtabladcajas();
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
        console.log(this.primerdia,'-',this.ultimodia);
        console.log(this.matrizdia);
        console.log((this.primerdia+dia-1)%7);
        this.nombredia=this.matrizdia[(this.primerdia+dia-1)%7];
        this.diaactual=dia;
        console.log(this.nombredia);
        this.vervpd=1;
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
        let fecha=this.year+'-'+nmes+'-'+dia;
        this._VentasService.getventasfecha(fecha).subscribe(
            res=>{
                
                this.ventas=res;
                this.ventas.pago_efectivo+=this.ventas.pago_tarjeta;

                console.log(this.ventas);
            },
            err=>{
                console.log(<any>err);
            }
        );
        this.destruirtablaventas();
        this.reconstruirtablaventas();
    }
    mostrardetalleventas(arregloventa){
        this.modal.style.display = "block";
        this.getdetalleventas(arregloventa.id);
        this.getventa=arregloventa;
        console.log(this.getventa);
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
        //this.mostrar();
       
        setTimeout(function(){
            $(function(){
                 $('#tablaventas').DataTable({
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ]
                 });
            });
        },3000);
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
    
    destruir(){	
        var table = $('#mytable').DataTable(); table .clear() ;
        $('#mytable').DataTable().destroy();
    }
    reconstruir(id){
        this.tabla();
    }
}