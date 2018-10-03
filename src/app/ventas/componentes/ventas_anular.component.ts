import { Component,ViewContainerRef } from "@angular/core";
import { CajasModels } from "../../cajas/modelos/cajas";
import { CajasService } from '../../cajas/services/cajas.services';
import { DetalleCajasUsuarioService } from '../../cajas/services/detalle.cajas.usuarios.services';

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
import { VentasModel } from '../modelos/ventas';

declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
    selector:'cajasabiertas',
    templateUrl:'../views/ventas_anular.html',
    providers:[CajasService,ToastService,SucursalService,DetalleVentasService]
})
export class AnularVentaComponent{
    public cambiarcolor=null;
    public user:any;
    public titulo;
    public sucursales:any;
    public ventas:Array<any>=[];
    public detalleventas:DetalleVentasModel;
    public getventa:VentasModel;
    public modal;
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
        this.titulo="Anular Venta"
        this.toastr.setRootViewContainerRef(vcr);
        //this.tablaventas();
        this.user=this.auth.getUser();
    }
    ngOnInit(){
        this.getsucursales();
        this.getventa=new VentasModel(null,null,null,null,null,null,null,null,null,null,this.user.id);
        this.modal=document.getElementById('myModal');
        window.onclick = function(event) {
            if (event.target == this.document.getElementById('myModal')) {
                this.document.getElementById('myModal').style.display = "none";
            }
        }
    }
    selecttable(id){
       this.cambiarcolor=id;
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
    anularventa(ven){

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
    mostrardetalleventas(arregloventa){
        this.modal.style.display = "block";
        this.getdetalleventas(arregloventa.id);
        this.getventa=arregloventa;
        console.log(this.getventa);
    }
    
    cerrarmodal(){
        this.modal.style.display = "none";
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
        this.getventastotales(id);
        
    }
    destruir(){	
        var table = $('#mytable').DataTable(); table .clear() ;
        $('#mytable').DataTable().destroy();
    }
    reconstruir(id){
        this.tabla();
    }
}