import { Component, OnInit } from '@angular/core';
import { PagoService } from '../services/pago.service';
import { ProveedorModel } from '../../proveedor/models/proveedor';
import { PagoModel } from '../models/pago';
import { PagoDetalleModel } from '../models/pago-detalle';
import { UnidadModel } from '../models/unidad';
import { Router } from '@angular/router';
import { almacen } from '../../Almacenes/modelos/almacenes';
import { AlmacenesService } from '../../Almacenes/services/almacenes.service';
import { almacenstock } from '../../almacen/modelos/almacen';
import { producto } from '../../productos/modelos/productos';
import { ProductoService } from '../../productos/services/producto.service';

@Component({
    selector:'pago-add',
    templateUrl:'../views/pago-add.html',
    providers:[PagoService]
})
export class PagoAddComponent implements OnInit{

    public estado:boolean;
    public title:string;
    public codigo:any;
    public pago:PagoModel;
    public proveedores:ProveedorModel[];
    public compra:PagoDetalleModel;
    public compras:Array<PagoDetalleModel>=[];
    public unidades:UnidadModel[];
    public almacenes:almacen[];
    public productos:producto[];
    public total:number;

    constructor(
        private pagoService:PagoService,
        private almacenService:AlmacenesService,
        private productoService:ProductoService,
        public router:Router
    ){
        this.compra=new PagoDetalleModel(null,null,null,null,null);
        this.pago= new PagoModel(this.codigo,null,'',null,'');
        this.title="Compras";
        this.estado=true;
        this.total=0;
    }
    ngOnInit(){
        this.getProveedor();
        this.getCodigo();
        this.listUnidades();
        this.getAlmacenes();
        this.listProducto();
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

    onSubmit(id_proveedor:number,recibo:string,id_almacen:number,tipo:string){
        this.pago= new PagoModel(this.codigo,id_proveedor,recibo,id_almacen,tipo);
        this.pagoService.addPago(this.pago).subscribe(
            result=>{
                console.log(result);
                this.addDetalles();
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    //Almacenes 
    getAlmacenes(){
        this.almacenService.getAlmacenes().subscribe(
            result=>{
                this.almacenes=result;
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    //productos 
    listProducto(){
        this.productoService.listProductos().subscribe(
            result=>{
                this.productos=result;
                console.log(result);
            }
        );
    }
    //Unidades
    getAdd(){
        
        this.estado=false;
    }
    getSalir(){
        this.estado=true;
    }
    saveUnidad(uni:string){
        let unidad = new UnidadModel(uni);
        this.pagoService.addUnidad(unidad).subscribe(
            result=>{
                console.log(result);
                this.estado=true;
                this.listUnidades();
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    listUnidades(){
      this.pagoService.getUnidades().subscribe(
          result=>{
              this.unidades=result;
          },
          error=>{
            console.log(<any> error);
          }
      );  
    }
    //detalles
    addCompra(){
        this.compras.push(this.compra);
        console.log(this.compras)
        this.compra=new PagoDetalleModel(null,null,null,null,null);
        this.sumaTotal();
    }
    sumaTotal(){
        let total=0;
       this.compras.forEach(function(value){
         total=total+(value.cantidad*value.precio_unitario);
         console.log(total);
       });
       this.total=total;
    }
    exitCompra(index){
        this.compras.splice(index,1);
        this.sumaTotal();
    }
    addDetalles(){
        let pago=this.pagoService;
        let cod= this.codigo;
        this.compras.forEach(function(value){
            let pagoD=new PagoDetalleModel(cod,value.id_producto,value.cantidad,value.id_unidad,value.precio_unitario);
            let d_almacen=new almacenstock(null,null,value.id_producto,null,value.precio_unitario,null);
            pago.addPagoDetalle(pagoD).subscribe(
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
}