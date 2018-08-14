import { Component, OnInit } from '@angular/core';
import { PagoService } from '../services/pago.service';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { PagoAnulaModel } from '../models/pago-anular';
import { ProveedorModel } from '../../proveedor/models/proveedor';
import { ProveedorService } from '../../proveedor/services/proveedor.service';
import { EmpresaService } from '../../empresa/services/empresa.service';
import { EmpresaModel } from '../../empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { CompraAnularModel } from '../models/anula-compra';

declare var kendo:any;
declare var $:any;
@Component({
    selector:'pago-recibo',
    templateUrl:'../views/pago-recibo.html',
    providers:[PagoService],
    styleUrls:['../style/pago-recibo.component.css']
})
export  class PagoReciboComponent implements OnInit {
    public user:User;
    public empresaModel:EmpresaModel;
    public proveedor:ProveedorModel;
    public pago:PagoAnulaModel;
    public title='Recibo';
    //--------------------Pago------------------------
    public id_provee:number;
    public code:string;
    public nombre_proveedor:string;
    public documento:string;
    public nroBoleta:string;
    public almacen:string;
    public tipoPago:string;
    public subtotal:number;
    public igv:number;
    public exonerados:number;
    public gravados:number;
    public otros:number;
    public fecha:string;
    //-----------------Proveedor---------------------------
    public id:number;
    public ruc:string;
    public direccion:string;
    public telefono:string;
    public telefono2:string;
    public email:string;
    //------------------Empresa-------------------------
        public nombre_empresa:string;
        public ruc_empresa:string;
        public direccion_empresa:string;
        public departamento_empresa:string;
        public provincia_empresa:string;
        public distrito_empresa:string;
        public telefono1_empresa:string;
        public telefono2_empresa:string;
        public web_empresa:string;
        public email_empresa:string;
        public imagen_empresa:string;
        public url:string;
    //--------------------------Detalle------------------------
        public compras:any=[];
    //---------------------------------------------------------
    constructor(
        private pagoService:PagoService,
        private proveedorService:ProveedorService,
        private auth:AuthService,
        private route:ActivatedRoute,
        private router:Router,
        private empresaService:EmpresaService,
    ){
        this.user=this.auth.getUser();
        this.pago=this.pagoService.getPagoP();
        this.asignarPago(this.pago);
        this.url=environment.api_url;
    }
    ngOnInit(){
        this.getProveedor();
        this.getEmpresa();
        this.getDetalles(this.code);
    }
    generatePDF(){
        kendo.pdf.defineFont({
            "DejaVu Sans"             : "../../assets/fonts/DejaVuSans.ttf",
            "DejaVu Sans|Bold"        : "../../assets/fonts/DejaVuSans-Bold.ttf",
            "DejaVu Sans|Bold|Italic" : "../../assets/fonts/DejaVuSans-Oblique.ttf",
            "DejaVu Sans|Italic"      : "../../assets/fonts/DejaVuSans-Oblique1.ttf"
        });
        kendo.drawing.drawDOM($("#formConfirmation")).then(function(group) {
          kendo.drawing.pdf.saveAs(group, "Converted PDF.pdf");
        });
    }
    asignarPago(pago:PagoAnulaModel){
        this.id_provee=pago.id_prove;
        this.code=pago.code;
        this.nombre_proveedor=pago.nombre_proveedor;
        this.documento=pago.documento;
        this.nroBoleta=pago.nroBoleta;
        this.almacen=pago.almacen;
        this.tipoPago=pago.tipoPago;
        this.subtotal=pago.subtotal;
        this.igv=pago.igv;
        this.exonerados=pago.exonerados;
        this.gravados=pago.gravados;
        this.otros=pago.otro;
        this.fecha=pago.fecha;
    }

    asignarProveedor(provee:ProveedorModel){
        this.ruc=provee.ruc;
        this.direccion=provee.direccion;
        this.telefono=provee.telefono;
        this.telefono2=provee.telefono2;
        this.email=provee.email;
    }
    
    listar(){
        this.router.navigate(['/'+this.user.rol+'/transaccion/list']);
        this.pagoService.clear();
        
    }

    getProveedor(){
        this.proveedorService.getProveedor(this.id_provee).subscribe(
            result=>{
                this.proveedor=result;
                this.asignarProveedor(this.proveedor);

            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    getEmpresa(){
        this.empresaService.dataEmpresa().subscribe(
            result=>{
                this.empresaModel=result;
                this.asignarEmpresa(this.empresaModel);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }

    asignarEmpresa(empresa:EmpresaModel){
        this.nombre_empresa=empresa.nombre;
        this.ruc_empresa=empresa.ruc;
        this.direccion_empresa=empresa.direccion;
        this.departamento_empresa=empresa.departamento;
        this.provincia_empresa=empresa.provincia;
        this.distrito_empresa=empresa.distrito;
        this.telefono1_empresa=empresa.telefono1;
        this.telefono2_empresa=empresa.telefono2;
        this.web_empresa=empresa.web;
        this.email_empresa=empresa.email;
        this.imagen_empresa=this.url+'/empresa-img/'+empresa.imagen;
    }

    getDetalles(cod:string){
        this.pagoService.listDetallePago(cod).subscribe(
            result=>{
                this.compras=result;
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
}
