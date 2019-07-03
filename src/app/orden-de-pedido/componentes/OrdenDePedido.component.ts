import { Component,ViewContainerRef } from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import {OrdenPedidosService} from '../services/Ordendepedido.service';
import { OrdenDePedidoModel } from '../modelos/OrdendePedido';
import{almacen} from '../../Almacenes/modelos/almacenes';
import {AlmacenesService}from '../../Almacenes/services/almacenes.service';
import {producto} from '../../productos/modelos/productos';
import {ProveedorModel} from '../../proveedor/models/proveedor';
import {ProductoService} from '../../productos/services/producto.service';
import {ProveedorService} from '../../proveedor/services/proveedor.service';
import { DetalleOrdenDePedidoModel} from '../../detalle-orden-de-pedido/modelos/DetalleOrdendePedido';
import {DetalleOrdenPedidosService} from '../../detalle-orden-de-pedido/services/DetalleOrdenPedido.service';
import {AuthService} from '../../auth/services/auth.service';

import {ToastService} from '../../toastalert/service/toasts.service'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { PermisosRolesModel } from '../../usuarios/modelos/permisos_roles';
import { UsuarioService } from '../../usuarios/services/usuarios.service';
import { environment } from '../../../environments/environment';
import { User } from '../../auth/interfaces/user.model';

declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
  selector: 'productos-add',
  templateUrl: '../views/OrdenDePedido.component.html',
  providers: [OrdenPedidosService,AlmacenesService,ProductoService,DetalleOrdenPedidosService,ToastService]
})
export class OrdenDePedidoComponent{
    public code:string;
    public titulo:string;
    public almacenes:almacen;
    public productos:producto;
    public provedores:any=[];;
    public agregarOrdenPedido:OrdenDePedidoModel;
    public agregarDetalleOrden:DetalleOrdenDePedidoModel;
    public ordenPedido:OrdenDePedidoModel;
    public pedidos:Array<DetalleOrdenDePedidoModel>=[];
    public fecha:string;
    public fecha2:string;
    public mostrar;
    public mostrarguardar;
    public user:User;
    public id;
    public texto;
    public editar;
    public nombres;
    public quitar;
    public usuario;
    public almacenvalid;
    public provedorvalid;
    public fechavalidad;
    public seleccionado;
    public textocantidad;
    public terminosycon;
    public url;
    public mandar:PermisosRolesModel;
    public verlistar=null;
    public verpag=null;
    constructor(
        private _almacenesService:AlmacenesService,
        private _route:ActivatedRoute,
        private _router:Router,
        private _ordenPedidoService:OrdenPedidosService,
        private _ProductoService:ProductoService,
        private _detalleorden:DetalleOrdenPedidosService,
        private _proveedorservice:ProveedorService,
        private auth:AuthService,
        private toaste:ToastService,
        public toastr: ToastsManager,
        vcr: ViewContainerRef,
        private _UsuarioService:UsuarioService,
    ){
        this.url=environment.url+'admin/pedido';
        this.user=this.auth.getUser();
        this.mandar = new PermisosRolesModel(this.user.id,null,this.url,null,null);
        let i=0; 
        this._UsuarioService.getpermisos(this.mandar).subscribe(
            res=>{
                console.log(res)
                if(res.mensaje==true){
                    this.verpag=true;
                    
                    this.mandar.url=environment.url+'admin/pedido/listar';
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
                }else{
                    if(res.mensaje!=false){
                        this.verpag=true;
                        
                        this.mandar.url=environment.url+'admin/pedido/listar';
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
                    }else{
                        console.log('1')
                        this._router.navigate(['/'+this.user.rol]);
                    }
                }
               
                console.log(this.verlistar);
            },
            err=>{
                console.log(<any>err);
            }
        )
        this.toastr.setRootViewContainerRef(vcr);
        this.titulo="Orden De Pedido";
        
        this.agregarOrdenPedido=new OrdenDePedidoModel(0,null,null,null,null,null);
        this.agregarDetalleOrden=new DetalleOrdenDePedidoModel(0,0,'',0);
        this.fecha=null;
        this.fecha2;
        this.mostrar=null;
        this.mostrarguardar=null;
        this.id=0;
        this.editar=null;
        this.quitar=null;
        this.usuario=this.auth.getUser();;
        this.texto=null;
        this.almacenvalid=false;
        this.provedorvalid=false;
        this.seleccionado=null;
        this.fechavalidad=true;
        this.terminosycon=null;
    }
    ngOnInit(){
        //this.getCode();
        this.mostraralmacen();
        this.mostrarproveedor();
        this.mostrarproducto();
        this.fechaactual();
    } 
   /* getCode(){
        this._ordenPedidoService.getCodigo().subscribe(
            result=>{
                this.code=result;
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    */ 
    mostraralmacen(){
        this._almacenesService.mostraalmacenusuario(this.usuario.id).subscribe(
            result=>{
                this.almacenes=result;
                console.log(result);

            },
            error=>{
                console.log(<any>error);
            }   
        );

    }
    fechavalidacion(fecha){
        if(this.fecha2>fecha){
            console.log('no sirvew');
            this.fechavalidad=false;
        }else{
            console.log('cambiar a true');
            this.fechavalidad=true;
        }
    }
    almacenvalidacion(id){
        this.almacenvalid=true;
        console.log(this.almacenvalid);
       this.seleccionado=id;
    }
    proveedorvalidacion(){
        this.provedorvalid=true;
        console.log(this.provedorvalid);
    }
    mostrarproveedor(){
        this._proveedorservice.getTable().subscribe(
            result=>{
                this.provedores=result;
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }   
        );

    }
    mostrarproducto(){
        this._ProductoService.getProductos().subscribe(
            result=>{
                this.productos=result;
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }   
        );
    }
    volver(){
        this._router.navigate(['/'+this.usuario.rol+'/pedido/listar']);
   }
    fechaactual(){
        this._ordenPedidoService.getfecha().subscribe(
            result=>{
                this.fecha2=result.res;
                this.agregarOrdenPedido=new OrdenDePedidoModel(0,null,null,0,null,result.res);
            },
            error=>{
                console.log(<any>error);
            }   
        )
    }
    cambio(){
        this.mostrar=1;
        this.tabla();
        console.log(this.mostrar);
    }
    ocultar(){
        this.mostrar=null;
    }
    deletepedido(idindice){
        this.mostrarguardar=this.mostrarguardar-1;
        
        console.log(this.productos[idindice].id);
        //this.pedidos.splice(index,1);
        while(this.id<this.pedidos.length){
            if(this.pedidos[this.id].id===idindice)
            {
                this.productos[idindice].id=this.pedidos[this.id].id_orden_pedido;
                this.pedidos.splice(this.id,1);
            }
            this.id=this.id+1;
        }
        this.id=0;
    }
    addpedido(nombre,idente,idpro){
        console.log(idpro);
        if(this.pedidos.length>1){
            this.texto=this.pedidos.length;
        }
        this.mostrarguardar=this.mostrarguardar+1;
        this.productos[idente].id=this.quitar;
        this.agregarDetalleOrden.id=idente;
        this.agregarDetalleOrden.id_producto=nombre;
        this.agregarDetalleOrden.id_orden_pedido=idpro;
        this.pedidos.push(this.agregarDetalleOrden);
        this.agregarDetalleOrden=new DetalleOrdenDePedidoModel(null,null,null,null);
        console.log(this.pedidos);

        console.log(this.productos);
        console.log(this.agregarOrdenPedido)
        
    }
    mostarterminos(){
        this.terminosycon=1;
    }
    vercuadrotexto(id){
        console.log(id)
        this.texto=id;
    }
    limpiar(){
        while(this.id<this.pedidos.length){
            this.productos[this.pedidos[this.id].id].id=this.pedidos[this.id].id_orden_pedido;
            this.pedidos.splice(this.id,1);
        }
        this.mostrarguardar=0;
        this.id=0;
        this.mostrar=null;
        this.agregarOrdenPedido=new OrdenDePedidoModel(0,null,null,0,null,null);
        this.fechavalidad=false;
        this.seleccionado=0;
        this.terminosycon=null;
    }
    guardartodo(){
        let indice=0;
        let index=0;
        let aprobado=true;
        this.textocantidad=document.getElementById('pruebacantidad');
        while(index<this.pedidos.length){
            if(this.pedidos[index].cantidad<1){
                aprobado=false;
                indice=index;
                index=this.pedidos.length-1;
            }
            index=index+1;
        }
        if(aprobado===true){
            if(this.agregarOrdenPedido.id_almacen>0){
                this._ordenPedidoService.addOrdenPedido(this.agregarOrdenPedido).subscribe(
                    result=>{
                        let resultado=result;
                        this.storagePedido(resultado);//--------Almacenamiento en el local storage
                        this.guardardetalleorden();
                        this.guardaralerta();
                        this.limpiar();
                    },
                    error=>{
                        console.log(<any>error);
                    }
        
                );
            }else{
                let text="seleccione un almacen";
                this.toaste.errorAlerta(text,'Error!No se pudo guardar su pedido ');
            }
            
        }else{
            let text="coloque una cantidad superio a 0";
            this.toaste.errorAlerta(text,'Error!No se pudo guardar su pedido ');
            this.texto=indice;
            //this.textocantidad.focus();
        }
    }
    guardardetalleorden(){

        while(this.id<this.pedidos.length){
            console.log(this.pedidos[this.id]);
            this.agregarDetalleOrden=this.pedidos[this.id];
            console.log(this.agregarDetalleOrden);
            this._detalleorden.adddetalleOrdenPedido(this.agregarDetalleOrden).subscribe(
                result=>{
                    console.log(result);
                        
                },
                error=>{
                    console.log(<any>error);
                }
    
            ) 
            this.id=this.id+1
            if(this.id==this.pedidos.length){
                this._router.navigate(['/'+this.usuario.rol+'/pedido/recibo']);
            }
        }
        this.id=0;
    }
    exitCompra(index,idpedi){
        console.log(this.pedidos[index].id_orden_pedido);
        console.log(index,idpedi);;
        this.mostrarguardar=this.mostrarguardar-1;
        this.productos[idpedi].id=this.pedidos[index].id_orden_pedido;
        this.pedidos.splice(index,1);
        console.log(idpedi);
    }
    editarcantidad(indi){
        console.log(indi);
        this.editar=indi;
    }
    ingresarcantidad(c){
        this.agregarDetalleOrden.cantidad=c;
        this.editar=null;
        console.log(c);
    }
    cancelar(){
        this.editar=null;
    }
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#mytable').DataTable({
                     dom: 'Bfrtip',
                     buttons: [
                        
                     ]
                 });
            });
        },500);
    }
    guardaralerta(){
        swal({
            position: 'center',
            icon: "success",
            title: 'se genero el pedido',
            buttons: false,
            timer: 1500
          })
    }
    storagePedido(pedido:OrdenDePedidoModel){
        if(!this._ordenPedidoService.getOrdenPedido()){
            this._ordenPedidoService.setOrdenPedido(pedido);
            //this._router.navigate(['/'+this.usuario.rol+'/pedido/recibo']);
        }else{
            this._ordenPedidoService.clear();
            this._ordenPedidoService.setOrdenPedido(pedido);
            //this._router.navigate(['/'+this.usuario.rol+'/pedido/recibo']);
        }
    }
}