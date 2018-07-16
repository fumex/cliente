import { Component,ViewContainerRef } from "@angular/core";
import { DetalleCaja } from "../modelos/detalle_almacen";
import { DetalleCajasService } from '../services/DetalleCajas.service';
import { DetalleCajasUsuarioService } from '../../cajas/services/detalle.cajas.usuarios.services';
import { AlmaceneService} from '../../almacen/services/almacen.services';
import { producto} from '../../productos/modelos/productos';
import { detalleimpuestoservice} from '../../detalle_impuesto/services/detalle_impuesto.service';
import { ClienteService} from '../../cliente/services/cliente.service'


import { User } from "../../auth/interfaces/user.model";
import { AuthService } from "../../auth/services/auth.service";

import {ToastService} from '../../toastalert/service/toasts.service'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { environment } from "../../../environments/environment";
import { ProductoModule } from "../../productos/productos.module";

declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
    selector:'ventas',
    templateUrl:'../views/ventas.component.html',
    providers:[DetalleCajasService,ToastService,DetalleCajasUsuarioService,AlmaceneService,detalleimpuestoservice,ClienteService]
})
export class VentasComponent{
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
    constructor(
        private _DetalleCajasService:DetalleCajasService,
        private _DetalleCajasUsuarioService:DetalleCajasUsuarioService,
        private  _AlmaceneService:AlmaceneService,
        private _detalleimpuestoservice:detalleimpuestoservice,
        private _ClienteService:ClienteService,
        private auth:AuthService,
        private toaste:ToastService,
        public toastr: ToastsManager,
        vcr: ViewContainerRef
    ){

        this.toastr.setRootViewContainerRef(vcr);
        this.user=this.auth.getUser();
        this.titulo="Ventas";
        this.DetalleCaja=new DetalleCaja(null,null,null,null,null,null,null,null);
        
    }
    exit(){
        
    }
    ngOnInit(){
        this.obtenercajas();
        this.traercliente();
        //this.alertaapertura();
        //this.data = [];
        for(var i = 3; i < 5; i++)
        {
        
            this.data.push({ id:i, preg:[] });
            this.data[ this.data.length-1].preg.push( {pid: i, preg: "Aqui pregunta" });
            this.data[ this.data.length-1].preg.push( {pid: i+1, preg: "Aqui pregunta2" });
        }

        console.log( this.data);
    }
    seleccionarbfactura(){
        this.factura=true;
        this.boleta=false;
    }
    seleccionarboleta(){
        this.factura=false;
        this.boleta=true;
    }
    irausuarios(){
        this.tabs=document.getElementById('tabcli');
        this.tabs.click();
    }
    seleccionarcliente(id,nombre,doc,nrodoc){
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
        swal("Escriba el monto de apertura:", {
            content: "input",
            button: "aperturar",
          })
          .then((value) => {
            if(isNaN(parseInt(value))){
                
                this.toaste.WarningAlert('el valor del monto debe ser un numero','Error¡¡');
                
            }else{
                
                this.DetalleCaja.monto_apertura=parseInt(value);
                this.DetalleCaja.id_caja=id;
                this.DetalleCaja.id_usuario=this.user.id;
                this.mostarproductos();
               
                console.log(this.DetalleCaja);
            }
            
          });
        this.id_caja=id;
        
    }
    mostarproductos(){
        let indice=0;
        this._DetalleCajasService.AperturaCaja(this.DetalleCaja).subscribe(
            res=>{
                if(res.code==200){
                    this._AlmaceneService.SeleccionarAlmacenporcaja(this.id_caja).subscribe(
                        res=>{
                            
                            
                           while(indice<res.length){
                               this.pro=res[indice];
                               this.productos.push({
                                imagen:res[indice].imagen,
                                nombre_producto:res[indice].nombre_producto,
                                descripcion:res[indice].descripcion,
                                unidad:res[indice].unidad,
                                nombre:res[indice].nombre,
                                precio_venta:res[indice].precio_venta,
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
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    tablacajas(){
        setTimeout(function(){
            $(document).ready(function() {
                 $('#tablacajas').DataTable({
                    //"lengthChange": false,
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

}