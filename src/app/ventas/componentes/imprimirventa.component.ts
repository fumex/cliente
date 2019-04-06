import { Component,ViewContainerRef } from "@angular/core";
import { DetalleCajasUsuarioService } from '../../cajas/services/detalle.cajas.usuarios.services';

import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';
import {DettaleUsuarioService} from '../../usuarios/services/DetalleUsuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import {SucursalModel} from '../../sucursales/modelos/sucursal';
import {UsuarioModel} from '../../usuarios/modelos/usuarios';
import {ToastService} from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {DetalleCaja} from '../modelos/detalle_cajas';
import {DetalleVentasModel} from '../../ventas/modelos/detalle_ventas';
import {codigoProductosModel} from '../../ventas/modelos/codigo_productos';
import {DetalleVentasService} from '../services/DetalleVentas.service';
import {VentasService} from '../services/Ventas.service';
import { VentasModel } from '../modelos/ventas';
import {AnularDetalleModel} from '../modelos/anular_detalle';
import {EmpresaService}from '../../empresa/services/empresa.service'; 
import {EmpresaModel}from '../../empresa/models/empresa' 
import { ImpuestoService } from "../../impuesto/services/impuesto.service";

import { environment } from '../../../environments/environment';
import{conversordenumerosaletras} from '../services/numeroaletras.service';
import { nullSafeIsEquivalent } from "@angular/compiler/src/output/output_ast";
import { ImpuestoModel } from "../../impuesto/models/impuesto";

declare var jQuery:any;
declare var $:any;
declare var swal:any;
declare var kendo:any;
@Component({
    selector:'cajasabiertas',
    templateUrl:'../views/imprimirventas.html',
    providers:[ToastService,DetalleVentasService,ImpuestoService,conversordenumerosaletras,VentasService]
})
export class ImprimirVentasComponent{
    public user:any;
    public getimp:Array<ImpuestoModel>=[];
    public codigo_productos:codigoProductosModel;
    public id_nota_credito=null;
    public total=null;
    public subtotal=null;
    public letrado=null;
    public tiponotas=new Array();
    public seriedenota=null;
    public ventas:VentasModel;
    public d_ventasvarante:any;
    public tipoventa=null;
    public nombretiponota=null;
    public contenido=null;
    public contenidoOriginal=null;
    public empresa:EmpresaModel;
    public impuestos:Array<any>=[];
    public codigos:Array<codigoProductosModel>=[];
    public url;
    imageUrl: string = "assets/images/1.png";
    public detalleventas:Array<DetalleVentasModel>=[];
    constructor(
        private _DettaleUsuarioService:DettaleUsuarioService,
        public _DetalleCajasUsuarioService:DetalleCajasUsuarioService,
        private _DetalleVentasService:DetalleVentasService,
        private conversor:conversordenumerosaletras,
        private auth:AuthService,
        private _ImpuestoService:ImpuestoService,
        private _VentasService:VentasService,
        private toaste:ToastService,
        public toastr: ToastsManager,
        private router:Router,
        private _EmpresaService:EmpresaService,
        vcr: ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.user=this.auth.getUser();
        this.url=environment.api_url; 
        this.imageUrl=this.url+'/imagenes/2.png';
       
    }
    ngOnInit(){
        this.empresa=new EmpresaModel(null,null,null,null,null,null,null,null,null,null,null,null,null,null,false,false,null);
        this.getempresas();
        this.ventas=this._VentasService.recojerdatos('ventas');
        if(this.ventas!=null){
            
            if(this.ventas.serie_venta.charAt(0)=="F"){
                this.tipoventa="FACTURA";
            }else{
                this.tipoventa="BOLETA";
            }
            
            this.detalleventas=this._VentasService.recojerdatos('detalle_ventas');
            this.impuestos=this._VentasService.recojerdatos('impuestos');
            this.codigos=this._VentasService.recojerdatos('codigo');
            /*this._VentasService.cleardatos('ventas');
            this._VentasService.cleardatos('detalle_ventas');
            this._VentasService.cleardatos('impuestos');
            this._VentasService.cleardatos('codigo');
            
            console.log(this.ventas);
            console.log(this.d_ventasvarante);
            console.log(this.impuestos);*/
        }else{
            this.ventas=new VentasModel(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null)
            this.router.navigate(['/'+this.user.rol+'/ventas']);
        }
    }
    getempresas(){
        this._EmpresaService.dataEmpresa().subscribe(
            res=>{
                this.empresa=res;
                console.log(res)
                console.log(this.empresa);
                this.imageUrl=this.url+'/empresa-img/'+this.empresa.imagen;
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    prueba(){
        console.log('prueba');
    }
    imprimir(){
        console.log("nasda");
        this.contenido= document.getElementById('imprimir').innerHTML;
        
        this.contenidoOriginal= document.body.innerHTML;                                                                                
        document.body.innerHTML = this.contenido;
        window.print();
        document.body.innerHTML = this.contenidoOriginal;
        location.reload();
    }
    pdf(){
        kendo.pdf.defineFont({
            "DejaVu Sans"             : "../../assets/fonts/DejaVuSans.ttf",
            "DejaVu Sans|Bold"        : "../../assets/fonts/DejaVuSans-Bold.ttf",
            "DejaVu Sans|Bold|Italic" : "../../assets/fonts/DejaVuSans-Oblique.ttf",
            "DejaVu Sans|Italic"      : "../../assets/fonts/DejaVuSans-Oblique1.ttf"
        });
        kendo.drawing.drawDOM($("#imprimir")).then(function(group) {
          kendo.drawing.pdf.saveAs(group, "Converted PDF.pdf");
        });
    }
    volver(){
        console.log('volver')
    }
    imprimirElemento(elemento) {
        var divToPrint = document.getElementById('imprimir');
        var newWin = window.open('', 'Print-Window');
        newWin.open();
        newWin.document.write('<html><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
        newWin.document.close();
        newWin.focus();
        newWin.onload=function(){
            window.print();
            window.close();
        }
        setTimeout(function() { newWin.close(); }, 1);
    }
    imp(){
        var div = document.querySelector("#imprimir");
        this.imprimirElemento(div);
    }
    

}