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
    public sielnombreesigual;
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
        this.sielnombreesigual=0;
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
        console.log(this.mostrar);
    }
    addpedido(nombre,c){
        this.mostrarguardar=this.mostrarguardar+1;
        /*if(this.pedidos.length>0)
        {
            while(this.id<this.pedidos.length){
            this.id=this.id+1;
            if(this.pedidos[this.id-1].id_producto==nombre)
            {
                this.sielnombreesigual=this.id;
                this.id=this.pedidos.length;
            }

            }
        }
        

        if(this.sielnombreesigual>0){
            this.agregarDetalleOrden.cantidad=this.pedidos[this.sielnombreesigual].cantidad+c;
        }**/
            
        this.agregarDetalleOrden.id_producto=nombre;
        this.agregarDetalleOrden.cantidad=c;
        this.pedidos.push(this.agregarDetalleOrden);
        this.agregarDetalleOrden=new DetalleOrdenDePedidoModel(null,null,null,null);
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
    exitCompra(index){
        this.pedidos.splice(index,1);
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
}