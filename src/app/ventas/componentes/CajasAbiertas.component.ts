import { Component,ViewContainerRef } from "@angular/core";
import { CajasModels } from "../../cajas/modelos/cajas";
import { CajasService } from '../../cajas/services/cajas.services';
import { DetalleCajasUsuarioService } from '../../cajas/services/detalle.cajas.usuarios.services';

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
    templateUrl:'../views/cajasabiertas.html',
    providers:[CajasService,ToastService,SucursalService,DetalleVentasService]
})
export class ResumenCajasAbiertasComponent{
    public user:any;
    public titulo;
    public sucursales:any;
    public cajas:Array<any>=[];
    public ventas:Array<any>=[];
    public detalleventas:DetalleVentasModel;
    public getcaja:DetalleCaja;
    public getventa:VentasModel;
    public modal;
    public vercajas=null;
    public verventas=null;
    public vertodaslasventas=false;
    constructor(
        private _cajasservice:CajasService,
        private _SucursalService:SucursalService,
        private _DettaleUsuarioService:DettaleUsuarioService,
        public _DetalleCajasUsuarioService:DetalleCajasUsuarioService,
        private _DetalleVentasService:DetalleVentasService,
        private auth:AuthService,
        private toaste:ToastService,
        public toastr: ToastsManager,
        vcr: ViewContainerRef
    ){
        this.titulo="Sucursales Disponibles"
        this.toastr.setRootViewContainerRef(vcr);
        //this.tablaventas();
        this.user=this.auth.getUser();
    }
    ngOnInit(){
        this.getsucursales();
        this.getcaja=new DetalleCaja(null,null,null,null,null,null,null,null,null,null);
        this.getventa=new VentasModel(null,null,null,null,null,null,null,null,null,null,this.user.id,null,null,null,null,0);
        this.modal=document.getElementById('myModal');
        window.onclick = function(event) {
            if (event.target == this.document.getElementById('myModal')) {
                this.document.getElementById('myModal').style.display = "none";
            }
        }
    }
    getsucursales(){
        this._SucursalService.getsucursalporusuario(this.user.id).subscribe(
            res=>{
                console.log(res);
                this.sucursales=res;
                
            },
            err=>{
                console.log(err);
            }
        );
    }
    getcajas(id){
        let i =0;
        this.vercajas=id;
        this._cajasservice.getcajasporsucursal(id).subscribe(
            res=>{
                
                while(i < res.length){
                    if(res[i][0].monto_cierre_tarjeta==null){
                        res[i][0].monto_cierre_tarjeta=0;
                    }
                    
                    res[i][0].monto_apertura=this.pasaranumero(res[i][0].monto_apertura);
                    res[i][0].monto_cierre_efectivo=this.pasaranumero(res[i][0].monto_cierre_efectivo);
                    res[i][0].monto_cierre_tarjeta=parseInt(res[i][0].monto_cierre_tarjeta);
                    this.cajas.push(res[i][0])
                    i++;
                }
                console.log(this.cajas)
            },
            err=>{
                console.log(err);
            }
        );
    }
    traerdetallecaja(id){
        let i=0;
        console.log(id);
        this._cajasservice.getdetallecajas(id).subscribe(
            res=>{
                
                while(i < this.cajas.length){
                    if(this.cajas[i].id==id){
                        if(res[0].monto_cierre_tarjeta==null){
                            res[0].monto_cierre_tarjeta=0;
                        }
                        res[0].monto_apertura=this.pasaranumero(res[0].monto_apertura);
                        res[0].monto_cierre_efectivo=this.pasaranumero(res[0].monto_cierre_efectivo);
                        res[0].monto_cierre_tarjeta=parseInt(res[0].monto_cierre_tarjeta);
                        this.cajas[i]=res[0];
                        console.log(res);
                    }
                    i++;
                }
                console.log(this.cajas)
            },
            err=>{
                console.log(err);
            }
        );
    }
    traerventas(arreglodetalle,index){
        this.vertodaslasventas=false;
        console.log(this.vertodaslasventas);
        this.verventas=arreglodetalle.id;
        this.vercajas=null;
        this.getcaja=this.cajas[index];
        console.log(this.getcaja)
        this.destruirtablaventas();
       this.reconstruirtablaventas(arreglodetalle.id)
    }
    traerventastotales(id){
        this.vertodaslasventas=true;
        this.verventas=id;
        this.destruirtablaventas();
        this.reconstruirtablaventas(id);
    }
    getventastotales(id){
        let i=0;
        this._cajasservice.getventasporsucursal(id).subscribe(
            res=>{
                while(i<res.length){
                    res[i].total=parseFloat(res[i].total);
                    res[i].pago_efectivo=parseFloat(res[i].pago_efectivo);
                    res[i].pago_tarjeta=parseFloat(res[i].pago_tarjeta);
                    i++;
                }
                this.ventas=res;
                console.log(this.ventas)
            },
            err=>{
                console.log(err);
            }
        )       
    }
    getventas(id){
        let i=0;
        this._cajasservice.getventas(id).subscribe(
            res=>{
                while(i<res.length){
                    res[i].total=parseFloat(res[i].total);
                    res[i].pago_efectivo=parseFloat(res[i].pago_efectivo);
                    res[i].pago_tarjeta=parseFloat(res[i].pago_tarjeta);
                    i++;
                }
                this.ventas=res;
                console.log(this.ventas)
            },
            err=>{
                console.log(err);
            }
        );
    }
    mostrardetalleventas(arregloventa){
        this.modal.style.display = "block";
        this.getdetalleventas(arregloventa.id);
        this.getventa=arregloventa;
        console.log(this.getventa);
    }
    
    cerrarmodal(){
        this.modal.style.display = "none";
    }
    limpiarcajas(){
        let i =0;
        while(i<this.cajas.length){
            this.cajas.splice(0,1);
        }
    }
    volverasucursales(){
        this.limpiarcajas();
        console.log(this.cajas);
        this.vercajas=null;
        this.verventas=null
        this.vertodaslasventas=false;
        this.destruirtablaventas();
    }
    volveracajs(){
        this.destruirtablaventas();
        this.vercajas=1;
        this.verventas=null;
        this.vertodaslasventas=false;
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
    limpiar(){
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
    alertaeliminar(id){
        swal({
            title: "esta seguro de eliminar esta caja",
            text: "se eliminaran los cambios relacionados con la caja",
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
        if(this.vertodaslasventas==false){
            this.getventas(id);
        }else{
            this.getventastotales(id);
        }
        
    }
    destruir(){	
        var table = $('#mytable').DataTable(); table .clear() ;
        $('#mytable').DataTable().destroy();
    }
    reconstruir(id){
        this.tabla();
    }
}