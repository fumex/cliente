import { Component, OnInit } from '@angular/core';
import { OrdenPedidosService } from '../services/Ordendepedido.service';
import { ProveedorService } from '../../proveedor/services/proveedor.service';
import { AlmacenesService } from '../../Almacenes/services/almacenes.service';
import { EmpresaService } from '../../empresa/services/empresa.service';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpresaModel } from '../../empresa/models/empresa';
import { ProveedorModel } from '../../proveedor/models/proveedor';
import { environment } from '../../../environments/environment';
import { OrdenDePedidoModel } from '../modelos/OrdendePedido';
import { almacen} from '../../Almacenes/modelos/almacenes';

declare var kendo:any;
declare var $:any;
@Component({
    selector:'orden-pdf',
    templateUrl:'../views/ordenPedido-pdf.html',
    providers:[OrdenPedidosService],
    styleUrls:['../style/ordenPedidoPdf.css']
})
export class OrdenPedidoPdf implements OnInit{
    public title:string;
    public empresaModel:EmpresaModel;
    public proveedor:ProveedorModel;
    public ordPedido:OrdenDePedidoModel;
    public detalleOrde:any[];
    public almacen:almacen;
    //-----------------Usuario----------------------------
    public nombre_usuario:string;
    //----------------------ALMACEN-----------------------
    public nombre_almacen: string;
    public descripcion_almacen: string;
    public direccion_almacen: string;
    public telefono_almacen: number;
    //-----------------Proveedor---------------------------
    public id_proveedor:number;
    public nombre_proveedor:string;
    public ruc_proveedor:string;
    public direccion_proveedor:string;
    public telefono_proveedor:string;
    public telefono2_proveedor:string;
    public email_proveedor:string;
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
    //-----------------Orden de Pedido----------------------
    public id_ordem:number;
    public id_almacen:number;
    public fecha_entrega:Date;
    public terminos:string;
    public user:User;
    constructor(
        private route:ActivatedRoute,
        private router:Router,
        private ordenPedidoService:OrdenPedidosService,
        private proveedoService:ProveedorService,
        private almacenService:AlmacenesService,
        private empresaService:EmpresaService,
        private auth:AuthService
    ){
        this.ordPedido=this.ordenPedidoService.getOrdenPedido();
        this.title="PDF Orden Pedido";
        this.user=this.auth.getUser();
        this.url=environment.api_url;
    }
    ngOnInit(){
        this.getEmpresa();
        this.getProveedor();
        this.asignarOrdenPedido();
        this.getAlamcen();
        this.getDetallePedido();
        this.getUser();
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
    asignarOrdenPedido(){
        this.id_ordem=this.ordPedido.id;
        this.id_almacen=this.ordPedido.id_almacen;
        this.fecha_entrega=this.ordPedido.fecha_estimada_entrega;
        this.terminos=this.ordPedido.terminos;
    }
    listar(){
        this.router.navigate(['/'+this.user.rol+'/pedido/listar']);
    }
    getDetallePedido(){
        this.ordenPedidoService.getDetallePedido(this.ordPedido.id).subscribe(
            result=>{
                this.detalleOrde=result;
                console.log(this.detalleOrde);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    getAlamcen(){
        this.almacenService.SeleccionarAlmacen(this.id_almacen).subscribe(
            result=>{
                this.almacen=result;
                this.asignarAlmacen(this.almacen);
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
        )
    }
    getProveedor(){
        this.proveedoService.getProveedor(this.ordPedido.id_proveedor).subscribe(
            result=>{
                this.proveedor=result;
                this.asignarProveedor(this.proveedor);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    asignarProveedor(provee:ProveedorModel){
        this.nombre_proveedor=provee.nombre_proveedor;
        this.ruc_proveedor=provee.ruc;
        this.direccion_proveedor=provee.direccion;
        this.telefono_proveedor=provee.telefono;
        this.telefono2_proveedor=provee.telefono2;
        this.email_proveedor=provee.email;
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
    asignarAlmacen(almace:almacen){
	    this.nombre_almacen=almace.nombre;
	    this.descripcion_almacen=almace.descripcion;
	    this.direccion_almacen=almace.direccion;
	    this.telefono_almacen=almace.telefono;
    }
    getUser(){
       this.asignarUser(this.user);
    }
    asignarUser(user:User){
        this.nombre_usuario=user.name;
    }

}