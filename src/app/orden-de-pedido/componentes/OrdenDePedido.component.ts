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
    public editar;
    public nombres;
    public quitar;
    constructor(
        private _almacenesService:AlmacenesService,
        private _route:ActivatedRoute,
        private _router:Router,
        private _ordenPedidoService:OrdenPedidosService,
        private _ProductoService:ProductoService,
        private _detalleorden:DetalleOrdenPedidosService,
        private _proveedorservice:ProveedorService
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
    }
    ngOnInit(){
        this.mostraralmacen();
        this.mostrarproveedor();
        this.mostrarproducto();
        this.fechaactual();
    }  
    mostraralmacen(){
        this._almacenesService.getAlmacenes().subscribe(
            result=>{
                this.almacenes=result;
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }   
        );

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
    fechaactual(){
        this._ordenPedidoService.getfecha().subscribe(
            result=>{
                this.fecha2=result.res;
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
        this.mostrarguardar=this.mostrarguardar+1;
        this.productos[idente].id=this.quitar;
        this.agregarDetalleOrden.id=idente;
        this.agregarDetalleOrden.id_producto=nombre;
        this.agregarDetalleOrden.id_orden_pedido=idpro;
        this.pedidos.push(this.agregarDetalleOrden);
        this.agregarDetalleOrden=new DetalleOrdenDePedidoModel(null,null,null,null);
        console.log(this.pedidos);
        console.log(this.productos);
       /* this.id=0;
        this.sielnombreesigual=0;
        
        this.nombres=nombre;
        if(this.pedidos.length>=1){
            while(this.id<this.pedidos.length){
            this.id=this.id+1;
            console.log(this.pedidos[this.id-1].id_producto,this.id);
                if(this.nombres===this.pedidos[this.id-1].id_producto.toString())
                {
                   this.sielnombreesigual=this.id-1;
                }else{
                    
                }
            }
        }
        
        if(this.sielnombreesigual>0){
            //this.agregarDetalleOrden.cantidad=this.pedidos[this.sielnombreesigual].cantidad+c;
            console.log(this.sielnombreesigual);
            this.agregarDetalleOrden.id_producto=nombre;
            this.agregarDetalleOrden.cantidad=parseInt(this.pedidos[this.sielnombreesigual].cantidad.toString()) +parseInt(c);
            this.pedidos.splice(this.sielnombreesigual-1,1);
            this.pedidos.push(this.agregarDetalleOrden);
            console.log(this.pedidos);
            this.sielnombreesigual=0;*/
        
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
            },
            error=>{
                console.log(<any>error);
            }

        ) 
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
}