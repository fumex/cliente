import { Component } from '@angular/core';
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

declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
  selector: 'productos-add',
  templateUrl: '../views/OrdenDePedido.component.html',
  providers: [OrdenPedidosService,AlmacenesService,ProductoService,DetalleOrdenPedidosService]
})
export class OrdenDePedidoComponent{
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
    public id;
    public texto;
    public editar;
    public nombres;
    public quitar;
    public usuario;
    public almacenvalid;
    public provedorvalid;
    constructor(
        private _almacenesService:AlmacenesService,
        private _route:ActivatedRoute,
        private _router:Router,
        private _ordenPedidoService:OrdenPedidosService,
        private _ProductoService:ProductoService,
        private _detalleorden:DetalleOrdenPedidosService,
        private _proveedorservice:ProveedorService,
        private auth:AuthService,
    ){
        this.titulo="Orden De Pedido";
        
        this.agregarOrdenPedido=new OrdenDePedidoModel(0,null,null,0,null);
        this.agregarDetalleOrden=new DetalleOrdenDePedidoModel(0,0,'',0);
        this.fecha=null;
        this.fecha2="sas";
        this.mostrar=null;
        this.mostrarguardar=null;
        this.id=0;
        this.editar=null;
        this.quitar=null;
        this.usuario=this.auth.getUser();;
        this.texto=null;
        this.almacenvalid=false;
        this.provedorvalid=false;
    }
    ngOnInit(){
        this.mostraralmacen();
        this.mostrarproveedor();
        this.mostrarproducto();
        this.fechaactual();
    }  
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
    almacenvalidacion(){
        this.almacenvalid=true;
        console.log(this.almacenvalid);
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
                this.agregarOrdenPedido=new OrdenDePedidoModel(0,null,null,0,result.res);
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
            this.texto=this.pedidos.length-1;
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
        this.agregarOrdenPedido=new OrdenDePedidoModel(0,null,null,0,null);
    }
    guardartodo(){
        this._ordenPedidoService.addOrdenPedido(this.agregarOrdenPedido).subscribe(
            result=>{
                console.log(result);
                if(result.code===200){

                    this.guardardetalleorden();
                    this.guardaralerta();
                    
                }
            },
            error=>{
                console.log(<any>error);
            }

        ) 
       
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
                this._router.navigate(['/'+this.usuario.rol+'/pedido/listar']);
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
}