import { Component, OnInit,  ViewContainerRef} from '@angular/core';
import { PagoService } from '../services/pago.service';
import { ProveedorModel } from '../../proveedor/models/proveedor';
import { PagoModel } from '../models/pago';
import { PagoDetalleModel } from '../models/pago-detalle';
import { almacen } from '../../Almacenes/modelos/almacenes';
import { AlmacenesService } from '../../Almacenes/services/almacenes.service';
import { almacenstock } from '../../almacen/modelos/almacen';
import { DocumentoModel } from '../../TipoDocumento/models/documento';
import { DocumentoService } from '../../TipoDocumento/services/documento.service';
import { CompraModel } from '../models/compra';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/interfaces/user.model';
import { ProductoModule } from '../../productos/productos.module';

import {InventarioService} from '../../inventario/services/inventario.service';
import {inventario} from '../../inventario/modelos/inventario';

import { ToastService } from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

declare var jQuery:any;
declare  var $:any;
declare var swal:any;
@Component({
    selector:'pago-add',
    templateUrl:'../views/pago-add.html',
    providers:[PagoService,InventarioService, ToastService]
})
export class PagoAddComponent implements OnInit{

    public title:string;
    public codigo:any;
    public pago:PagoModel;
    public documentos:DocumentoModel[];
    public proveedores:ProveedorModel[];
    public compra:CompraModel;
    public id_pro:number;
    public compras:Array<CompraModel>=[];
    public almacenes:almacen[];
    public total:number;
    public productos:any=[];
    public confirmado:any=[];
    public user:User;

    public a1:boolean;
    public a2:boolean;
    public a3:boolean;
    public a4:boolean;
    public a5:boolean;
    public validacion:boolean;
    public val:boolean;

    public inventario:inventario;
    public inventarios:Array<inventario>=[];
    constructor(
        private pagoService:PagoService,
        private almacenService:AlmacenesService,
        private route:ActivatedRoute,
        private router:Router,
        private documentoService:DocumentoService,
        private auth:AuthService,

        private _inventarioservice:InventarioService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef
    ){
        //this.compra=new PagoDetalleModel(null,null,null,null,null);
        this.toastr.setRootViewContainerRef(vcr);
        this.user=this.auth.getUser();
        this.pago= new PagoModel(null,this.codigo,null,null,'',null,'',null,null);

        this.title="Compras";
        this.total=0;
        this.tabla();
        this.sumaTotal();
        this.a1=true;
        this.a2=true;
        this.a3=true;
        this.a4=true;
        this.a5=true;
        this.validacion=false;
        this.val=false;
    }
    ngOnInit(){
        this.getProveedor();
        this.getCodigo();
        this.getAlmacenes();
        this.listProducto();
        this.getDocumentos();
    }
    getProveedor(){
        this.pagoService.getProveedor().subscribe(
            result=>{
                this.proveedores=result;
            },
            error=>{
                console.log(<any>error)
            }
        );
    }
    getCodigo(){
        this.pagoService.getCodigo().subscribe(
            result=>{
                this.codigo=result;
            },
            error=>{
                console.log(<any>error);
            }

        );
    }
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#pagoadd').DataTable();
            });
        },4000);
     }

    onSubmit(id_proveedor:number,id_documento:number,recibo:string,id_almacen:number,tipo:string){
        let subtotal=this.sumaTotal();
        let igv=Number((this.total*0.18).toFixed(2));
        console.log(igv);
        this.pago= new PagoModel(null,this.codigo,id_proveedor,id_documento,recibo,id_almacen,tipo,subtotal,igv);
        this.pagoService.addPago(this.pago).subscribe(
            result=>{
                console.log(result);
                this.addDetalles();
                this.list();
                this.alertaSave();
            },
            error=>{
                console.log(<any>error);
                let text="EL numero del comprobante ya esta registrado";
                this.toaste.WarningAlert(text,'Error!');
            }
        );
    }

    //Tipo de Documento
    getDocumentos(){
        this.documentoService.getDocumComprobante().subscribe(
            result=>{
                this.documentos=result;
                console.log(this.documentos);
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        );
    }
    //almacen
    getAlmacenes(){
        this.almacenService.mostraalmacenusuario(this.user.id).subscribe(
            result=>{
                this.almacenes=result;
                console.log(this.almacenes);
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        );
    }
    //productos 
    listProducto(){
        this.pagoService.ListProductos().subscribe(
            result=>{
                this.productos=result;
                this.indexPro(this.confirmado,this.productos);
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        );
    }
    indexPro(_confirmado:any[],_productos:ProductoModule[]){
        for(let i=0; i<_productos.length;i++){
         _confirmado[i]=true;
        }
    }
    marcar(index){
        this.confirmado[index]=false;
    }
    //detalles
    addCompra(index,id,categoria,unidad_medida,articulo,descripcion){
        
        this.confirmado[index]=false;
        this.compra= new CompraModel(index,id,categoria,unidad_medida,null,null,articulo,descripcion,null,null);
        if(!this.existeCompra(id,this.compras)){
            this.compras.push(this.compra);
            console.log(this.compras);
            this.val=true;
            this.validar();
        }
        else{
            console.log('ya esta agregado');
        }
    }
    existeCompra( id,_compras:CompraModel[]){
        for(let i=0; i<_compras.length;i++){
            if(_compras[i].id===id){
                return true;
            }
        }
    }
    exitCompra(ind,index){
        this.compras.splice(index,1);
        console.log(this.compras);
        this.sumaTotal();
        this.confirmado[ind]=true;
        if(this.compras.length===0){
            this.val=false;
            this.validar();
        }else{
            this.val=true;
            this.validar();
        } 
    }
    
    //suma detalle
    sumaTotal(){
        let total=0;
       this.compras.forEach(function(value){
         total=total+(value.cantidad*value.precio);
         console.log(total);
       });
       this.total=total;
       return this.total;
    }
    //guardar todo
    addDetalles(){
        let pago=this.pagoService;
        let cod= this.codigo;
        let inventa=this._inventarioservice;
        let us=this.user.id;
        this.compras.forEach(function(value){
            let pagoD=new PagoDetalleModel(cod,value.id,value.cantidad,value.precio);
            let d_almacen=new almacenstock(null,null,value.codigo,value.vendible,value.id,value.cantidad,value.precio,null);
            let inven=new inventario(null,null,null,value.id,null,null,value.cantidad,null,value.precio,null,us);
                pago.addPagoDetalle(pagoD).subscribe(
                    result=>{
                        console.log(result);
                    },
                    error=>{
                        console.log(<any>error);
                    }
                );
                inventa.addinventariopago(inven).subscribe(
                    result=>{
                        console.log(result);
                    },
                    error=>{
                        console.log(<any>error);
                    }
                );
                pago.creUpDetalleAlmacen(d_almacen).subscribe(
                    result=>{
                        console.log(result);
                    },
                    error=>{
                        console.log(<any>error);
                    }
                ); 
            }   
        );
    }
    
    list(){
        this.router.navigate(['/'+this.user.rol+'/transaccion/list']);
    }
    //Validacion
    validate1(){
        this.a1=false;
        this.validar();
    }
    validate2(recibo){
        if(recibo===""){
            console.log('aqui');
            this.a2=true;
            this.val=false;
            this.validar();
        }else{
            this.a2=false;
            this.validar();
        }
    }
    validate3(){
        this.a3=false;
        this.validar();
    }
    validate4(){
        this.a4=false;
        this.validar();
    }
    validate5(){
        this.a5=false;
        this.validar();
    }
    validar(){
        if(this.a1==false && this.a2==false && this.a3==false && this.a4==false && this.a5==false){
           this.validacion=true;
           if(this.val==true){
                this.val=true;
              //this.destruir();
           }else{
               this.val=false;
           }
        }
        else{
            this.validacion=false;
        }
    }
    //----------Alertas----------------------------
    alertaSave(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Guardado...',
            buttons: false,
            timer: 6000,
        })   
    }
}