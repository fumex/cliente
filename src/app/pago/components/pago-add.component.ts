import { Component, OnInit} from '@angular/core';
import { PagoService } from '../services/pago.service';
import { ProveedorModel } from '../../proveedor/models/proveedor';
import { PagoModel } from '../models/pago';
import { PagoDetalleModel } from '../models/pago-detalle';
import { Router } from '@angular/router';
import { almacen } from '../../Almacenes/modelos/almacenes';
import { AlmacenesService } from '../../Almacenes/services/almacenes.service';
import { almacenstock } from '../../almacen/modelos/almacen';
import { DocumentoModel } from '../../TipoDocumento/models/documento';
import { DocumentoService } from '../../TipoDocumento/services/documento.service';
import { CompraModel } from '../models/compra';

declare  var $:any;
@Component({
    selector:'pago-add',
    templateUrl:'../views/pago-add.html',
    providers:[PagoService]
})
export class PagoAddComponent implements OnInit{

    public title:string;
    public codigo:any;
    public pago:PagoModel;
    public documentos:DocumentoModel[];
    public proveedores:ProveedorModel[];
    public compra:CompraModel;
   
    public compras:Array<CompraModel>=[];
    public almacenes:almacen[];
    public total:number;
    public productos:any=[];

   
    constructor(
        private pagoService:PagoService,
        private almacenService:AlmacenesService,
        public router:Router,
        public documentoService:DocumentoService,
    ){
        //this.compra=new PagoDetalleModel(null,null,null,null,null);
        this.pago= new PagoModel(this.codigo,null,null,'',null,'');
        this.title="Compras";
        this.total=0;
        this.tabla();
        this.sumaTotal();
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
                 $('#mytable').DataTable();
            });
        },3000);
     }

    onSubmit(id_proveedor:number,id_documento:number,recibo:string,id_almacen:number,tipo:string,cantidad,precio){
        this.pago= new PagoModel(this.codigo,id_proveedor,id_documento,recibo,id_almacen,tipo);
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
    //Tipo de Documento
    getDocumentos(){
        this.documentoService.getDocumComprobante().subscribe(
            result=>{
                this.documentos=result;
                console.log(this.documentos);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    //almacen
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
        this.pagoService.ListProductos().subscribe(
            result=>{
                this.productos=result;
            }
        );
    }
    //detalles
    addCompra(id,categoria,unidad_medida,articulo,descripcion){
        this.compra= new CompraModel(id,categoria,unidad_medida,null,articulo,descripcion,null,null);
        this.compras.push(this.compra);
        console.log(this.compras)
    }
    exitCompra(index){
        this.compras.splice(index,1);
        console.log(this.compras);
        this.sumaTotal();
    }
    //suma detalle
    sumaTotal(){
        let total=0;
       this.compras.forEach(function(value){
         total=total+(value.cantidad*value.precio);
         console.log(total);
       });
       this.total=total;
    }
    //guardar todo
    addDetalles(){
        let pago=this.pagoService;
        let cod= this.codigo;
        this.compras.forEach(function(value){
            
            let pagoD=new PagoDetalleModel(cod,value.id,value.cantidad,value.precio);
            let d_almacen=new almacenstock(null,null,value.codigo,value.id,null,value.cantidad,null);
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