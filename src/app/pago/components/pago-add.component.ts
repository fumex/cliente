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
import { codproMdel } from '../models/codigo_productos';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/interfaces/user.model';
import { ProductoModule } from '../../productos/productos.module';

import {InventarioService} from '../../inventario/services/inventario.service';
import {inventario} from '../../inventario/modelos/inventario';

import { ToastService } from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ImpuestoService } from '../../impuesto/services/impuesto.service';
import { ImpuestoModel } from '../../impuesto/models/impuesto';
import { ProductoDetalleModel } from '../../productos/modelos/producto_detalle';
import { ProductoService } from '../../productos/services/producto.service';

import { CodigoProductoService } from '../services/codigo_producto.service';
import { PermisosRolesModel } from '../../usuarios/modelos/permisos_roles';
import { environment } from '../../../environments/environment';
import { UsuarioService } from '../../usuarios/services/usuarios.service';

declare var jQuery:any;
declare  var $:any;
declare var swal:any;
@Component({
    selector:'pago-add',
    templateUrl:'../views/pago-add.html',
    providers:[PagoService,InventarioService, ToastService,CodigoProductoService]
})
export class PagoAddComponent implements OnInit{
    public modalpagodetalles;
    public title:string;
    public codigo:any;
    public pago:PagoModel;
    public documentos:DocumentoModel[];
    public proveedores:ProveedorModel[];
    public compra:CompraModel;
    public id_pro:number;
    public compras:Array<CompraModel>=[];
    public compradd:CompraModel;
    public almacenes:almacen[];
    public total:number;
    public productos:any=[];
    public pagoD:PagoDetalleModel;
    public codserie=null;
    public codinterno=null;

    public prods_d:Array<ProductoDetalleModel>=[];
    public produ_ds:ProductoDetalleModel[];
    public pro_im:ProductoDetalleModel;
    
    public textserie=null;
    public textinterno=null;

    public producto_codigos:Array<codproMdel>=[];
    public producto_codigo:codproMdel;

    public confirmado:any=[];
    public user:User;
    public _impuesto:number;
    public igv:number;
    public exoneracion:number;
    public otro:number;
    public gravados:number;

    public a1:boolean;
    public a2:boolean;
    public a3:boolean;
    public a4:boolean;
    public a5:boolean;
    public a6:boolean;
    public validacion:boolean;
    public val:boolean;
    public detallepago:PagoDetalleModel;
    public arreglodetallepagos:Array<PagoDetalleModel>=[];
    public inventario:inventario;
    public inventarios:Array<inventario>=[];
    public fecha2=null;
    public selectvendible=null;
    public mandar:PermisosRolesModel;
    public url;
    public verpago_add=null;
    public verlistar=null;
    constructor(
        private pagoService:PagoService,
        private productoService:ProductoService,
        private almacenService:AlmacenesService,
        private _CodigoProductoService:CodigoProductoService,
        private route:ActivatedRoute,
        private router:Router,
        private documentoService:DocumentoService,
        private auth:AuthService,
        private impuestoService:ImpuestoService,
        private _inventarioservice:InventarioService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef,
        private _UsuarioService:UsuarioService,
    ){
        //this.compra=new PagoDetalleModel(null,null,null,null,null);
        this.url=environment.url+'admin/transaccion';
        this.user=this.auth.getUser();
        this.mandar = new PermisosRolesModel(this.user.id,null,this.url,null,null);
        let i=0; 
        this._UsuarioService.getpermisos(this.mandar).subscribe(
            res=>{
                console.log(res)
                if(res.mensaje!=false){
                    this.verpago_add=true;
                    this.mandar.url=environment.url+'admin/transaccion/list';
                    this._UsuarioService.getpermisos(this.mandar).subscribe(
                        result=>{
                            if(result.mensaje!=false){
                                this.verlistar=true;
                            }
                        },
                        err=>{
                            console.log(<any>err);
                        }
                    )
                    console.log('entro')
                    this.toastr.setRootViewContainerRef(vcr);
                    this.user=this.auth.getUser();
                    this.pago= new PagoModel(null,this.codigo,null,null,null,'',null,'',null,0,0,0,0);
                    
                    this.title="Compras";
                    //----------impuestos
                    this.igv=0;
                    this.exoneracion=0;
                    this.otro=0;
                    //---------
                    this.total=0;
                    this.destruir();
                    this.tabla();
                    this.sumaTotal();
                    this.a1=true;
                    this.a2=true;
                    this.a3=true;
                    this.a4=true;
                    this.a5=true;
                    this.a6=true;
                    this.validacion=false;
                    this.val=false;
                }else{
                    this.router.navigate(['/'+this.user.rol]);
                }
            },
            err=>{
                console.log(<any>err);
            }
        )
    }
    ngOnInit(){
        var f=new Date();
        this.fecha2=f.getFullYear()+"-"+f.getMonth()+1+"-"+f.getDate();
        console.log(this.fecha2)
        this.getProveedor();
        this.getCodigo();
        this.getAlmacenes();
        this.listProducto();
        this.getDocumentos();

        this.textserie=document.getElementById('inputserie');
        this.textinterno=document.getElementById('inputinterno');

        this.compra=new CompraModel(null,null,null,null,null,null,null,null,null,null,false,null)
        this.producto_codigo=new codproMdel(null,null,null,null,null,null,null,null,null,null,this.user.id,null);
        this.modalpagodetalles=document.getElementById('modalpagodetalles');
        window.onclick = function(event) {
            if (event.target == this.document.getElementById('modalpagodetalles')) {
                this.document.getElementById('modalpagodetalles').style.display = "none";
            }
        }
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
    lisDetalleProduc(id){
        this.productoService.listDetalleProducto(id).subscribe(
            result=>{
                console.log('--aqui--');
                this.produ_ds=result;
                this.addDetalleProduct(this.produ_ds);
            },
            error=>{
                console.log(<any>error);
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

    onSubmit(id_proveedor:number,id_documento:number,recibo:string,id_almacen:number,tipo:string,fecha:Date){
        let subtotal=this.sumaTotal();
        //let impuesto=Number((this.total*this._impuesto).toFixed(2));
        //console.log(impuesto);
        this.pago= new PagoModel(null,this.codigo,fecha,id_proveedor,id_documento,recibo,id_almacen,tipo,subtotal,this.igv,this.exoneracion,this.gravados,this.otro);
        this.pagoService.addPago(this.pago).subscribe(
            result=>{
                console.log(result);
                this.addDetalles();
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
    enfocarserie(){
        $('#inputserie').select(); 
        $('#inputserie').focus(); 
    }
    enfocarinterno(){
        $('#inputinterno').select(); 
        $('#inputinterno').focus(); 
    }
    verprecionadoserie(event){
        this.textserie=document.getElementById('clickserie');
        if(event.keyCode == 13) {;
            if(this.codserie+1>=this.producto_codigos.length){
                this.codinterno=0;
                this.codserie=null;
                setTimeout(this.enfocarinterno, 300);
                
            }else{
                this.codserie+=1; 
                setTimeout(this.enfocarserie, 300);
                /*setTimeout(this.enfocarserie(),1000);
                this.enfocarserie()*/
            }
        }
    }
    verprecionadointerno(event){
        if(event.keyCode == 13) {
            //alert('you just clicked enter');
            if(this.codinterno+1>=this.producto_codigos.length){
                this.codinterno=null
                this.codserie=null
            }else{
                this.codinterno+=1;
                setTimeout(this.enfocarinterno, 300);
            }
        }
    }
    addDetalleProduct(_prods_d:ProductoDetalleModel[]){
        this.prods_d=this.prods_d.concat(_prods_d);
        console.log(this.prods_d);
    }

    vertextoserie(id){
        console.log(id)
        this.codserie=id;
        this.codinterno=null;
        setTimeout(this.enfocarserie, 300);
    }
    vertextointerno(id){
        console.log(id)
        this.codinterno=id;
        this.codserie=null;
        setTimeout(this.enfocarinterno, 300);
    }
    quitarproductocodigo(indexcodigo,indexproducto){
        let i=0,j=1;
        this.producto_codigos.splice(indexcodigo,1);
        this.compras[indexproducto].cantidad-=1;
        while(i<this.producto_codigos.length){
            if(this.producto_codigos[i].id_producto==this.compras[indexproducto].id){
                this.producto_codigos[i].id=j;
                j++
            }
            i++
        }
        //console.log(this.producto_codigos,'-',this.compras);
        this.sumaTotal();
    }

    eleminarcodigoindex(id){
        let i=0,number;
        while(i<this.producto_codigos.length){
            if(this.producto_codigos[i].id_producto==id){
                //console.log(this.producto_codigos[i]);
                this.producto_codigos.splice(i,1)
            }else{
                i++;
            }
        }
        console.log(this.producto_codigos)

    }
    
    exitCompra(ind,index,id_pro){
        this.compras.splice(index,1);
        //console.log(this.compras);
        this.sumaTotal();
        this.confirmado[ind]=true;
        this.exitDetallePro(id_pro);
        if(this.compras.length===0){
            this.val=false;
            this.validar();
            this.prods_d=[];
            console.log(this.prods_d);
        }else{
            this.val=true;
            this.validar();
        } 
        this.eleminarcodigoindex(id_pro);
    }
    
    exitDetallePro(id_prod){
        
        let pro=this.prods_d;
        for( let i=0;i<pro.length;i++){
            if(pro[i].id==id_prod){
                pro[i].nombre_producto='';
            }
        }
        console.log('aqui')
        this.prods_d=pro;
        console.log(this.prods_d);
    }
    
    //suma detalle
    sumaTotal(){
        let igv=0;
        let otro=0;
        let total=0;
        let gravados=0;
        let impues=this.prods_d;
        console.log(this.prods_d)
        let precio=0;
        let exoneracion=0;
        this.compras.forEach(function(comp){
            total=total+(comp.cantidad*comp.precio);
            console.log(total);
            precio=comp.cantidad*comp.precio;
            console.log(impues)
            impues.forEach(function(value){
                console.log(value.nombre);
                if(value.tipo.toUpperCase()=='IGV'){
                    if(value.nombre.toUpperCase()=='GRAVADOS'){
                        if(comp.nombre_producto==value.nombre_producto){
                            gravados=gravados + (precio/(1+ (value.porcentaje/100)))*(value.porcentaje/100);
                        }
                    }else{
                        if(value.nombre.toUpperCase()=='EXONERADOS'){
                            if(comp.nombre_producto==value.nombre_producto){
                                exoneracion=exoneracion + precio;
                            }
                        }else{
                            if(comp.nombre_producto==value.nombre_producto){
                                igv=igv + precio*value.porcentaje/100;
                            }
                        }
                    } 
                }
                else{
                    if(value.tipo.toUpperCase()=='OTRO'){
                        if(comp.nombre_producto==value.nombre_producto){
                            otro=otro + precio*value.porcentaje/100;
                        }
                    }
                }
            });
        });
        this.exoneracion=exoneracion;
        this.gravados=gravados;
        this.igv=igv;
        this.otro=otro;
        this.total=total;
        console.log('IGV: '+this.igv+'   -  '+'otro: '+this.otro+'  -  '+'exoneracion: '+this.exoneracion);
        return this.total;
    }
    //guardar todo
    existeCompra( id,_compras:CompraModel[]){
        for(let i=0; i<_compras.length;i++){
            if(_compras[i].id==id){
                return true;
            }
        }
    }
    addCompra(id_almacen){
        console.log(this.compras);
        this.confirmado[this.compra.ind]=false;
        console.log('entro')
        this.compras.push(this.compra);
        console.log(this.compras);
        this.val=true;
        this.validar();
        this.generararraycodigo(id_almacen);
        this.cerrarmodaldetalle(); 
        
    }
    generararraycodigo(id_almacen){
        let i=1;
        while(i<=this.compra.cantidad){
            this.producto_codigo=new codproMdel(i,this.compra.id,this.compra.nombre_producto,null,null,null,null,this.compra.vendible,this.compra.fecha,id_almacen,this.user.id,null);
            this.producto_codigos.push(this.producto_codigo);
            i++;
        }
        console.log(this.producto_codigos)
        this.producto_codigo=new codproMdel(null,null,null,null,null,null,null,null,null,null,this.user.id,null);
    }
    abrirmodaldetalles(index,id,categoria,unidad_medida,articulo,descripcion){
        
        if(!this.existeCompra(id,this.compras)){
            this.modalpagodetalles.style.display = "block";
            this.compra= new CompraModel(index,id,categoria,unidad_medida,null,null,articulo,descripcion,null,null,false,null);
            console.log(this.compra);
            console.log(this.compradd);
            this.lisDetalleProduc(this.compra.id);
        }
        else{
           this.toaste.errorAlerta('Ya existe','Error') 
        }
        //this.addCompra(index,id,categoria,unidad_medida,articulo,descripcion);
    }
    cerrarmodaldetalle(){
        this.modalpagodetalles.style.display = "none";
        this.compra=new CompraModel(null,null,null,null,null,null,null,null,null,null,false,null);
        this.sumaTotal();
    }
    abrirdetalles(indice){
        console.log(indice);
        this.compras[indice].estado=true;
        console.log(this.compras);
    }
    cerrardetalles(indice){
        this.compras[indice].estado=false;
        
    }
    addDetalles(){
        let pago=this.pagoService;
        let cod= this.codigo;
        let inventa=this._inventarioservice;
        let us=this.user.id;
        let i=0;
        let valorv=true;
        let id=0;
        console.log(this.compras)
        while(i<this.compras.length){
            console.log(this.compras[i].vendible,i);
            valorv=this.compras[i].vendible;
            id=this.compras[i].id;
            this.pagoD=new PagoDetalleModel(cod,this.compras[i].id,this.compras[i].cantidad,this.compras[i].precio,this.compras[i].vendible);
            let d_almacen=new almacenstock(null,null,this.compras[i].codigo,this.compras[i].vendible,this.compras[i].id,this.compras[i].cantidad,this.compras[i].precio,null,null);
            let inven=new inventario(null,null,null,this.compras[i].id,null,null,this.compras[i].cantidad,null,this.compras[i].precio,null,us,parseInt(this.compras[i].codigo));
                this.pagoService.addPagoDetalle(this.pagoD).subscribe(
                    result=>{
                        console.log(result);
                    },
                    error=>{
                        console.log(<any>error);
                    }
                );
                this._inventarioservice.addinventariopago(inven).subscribe(
                    result=>{
                        console.log(result);
                        console.log(valorv);
                        if(result.code==200){
                            this.pagoService.creUpDetalleAlmacen(d_almacen).subscribe(
                                result=>{
                                    console.log(result);
                                    if(result.code==200){
                                        this.guardarcodigoproductos(id);
                                    }
                                },
                                error=>{
                                    console.log(<any>error);
                                }
                            ); 
                            
                        }
                    },
                    error=>{
                        console.log(<any>error);
                    }
                );
            i++;
        }
        /*this.compras.forEach(function(value){
            let pagoD=new PagoDetalleModel(cod,value.id,value.cantidad,value.precio,value.vendible);
            let d_almacen=new almacenstock(null,null,value.codigo,value.vendible,value.id,value.cantidad,value.precio,null,null);
            let inven=new inventario(null,null,null,value.id,null,null,value.cantidad,null,value.precio,null,us,parseInt(value.codigo));
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
                        if(result.code==200 ){
                            if(value.vendible==true){
                                pago.creUpDetalleAlmacen(d_almacen).subscribe(
                                    result=>{
                                        console.log(result);
                                        if(result.code==200){
                                            this.guardarcodigoproductos();
                                        }
                                    },
                                    error=>{
                                        console.log(<any>error);
                                    }
                                ); 
                                
                            }
                            if(value.vendible==false){
                                
                            }
                        }
                    },
                    error=>{
                        console.log(<any>error);
                    }
                );
               
            }   
        );*/
    }
    camviarvenmdiable(){
        console.log(this.selectvendible);
        if(this.selectvendible==1){
            this.compra.vendible=true;
        }else{
            this.compra.vendible=false;
        }
    }
    guardarcodigoproductos(id){
        let i=0;

        while(i<this.producto_codigos.length){
        
            if(this.producto_codigos[i].id_producto==id){
                console.log(this.producto_codigos[i]);
                this._CodigoProductoService.guardarcodigosproducto_vendible(this.producto_codigos[i]).subscribe(
                    res=>{
                        console.log(res);
                        this.list();
                       
                    },
                    err=>{
                        console.log(err);
                    }
                )
               
            }
            i++
        }
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
    validate6(){
        this.a6=false;
        this.validar();
    }
    validar(){
        if(this.a1==false && this.a2==false && this.a3==false && this.a4==false && this.a5==false && this.a6==false){
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
    destruir(){
        var table = $('#pagoadd').DataTable();
        table .clear() ;
        $('#pagoadd').DataTable().destroy();
    }
}