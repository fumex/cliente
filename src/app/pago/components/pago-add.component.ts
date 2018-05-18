import { Component, OnInit } from '@angular/core';
import { PagoService } from '../services/pago.service';
import { ProveedorModel } from '../../proveedor/models/proveedor';
import { PagoModel } from '../models/pago';
import { PagoDetalleModel } from '../models/pago-detalle';
import { UnidadModel } from '../models/unidad';
import { Router } from '@angular/router';

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
    constructor(
        private pagoService:PagoService,
        public router:Router
    ){
        this.pago= new PagoModel(this.codigo,null,'','');
        this.compra= new PagoDetalleModel(this.codigo,null,null,null,null);
        this.title="Transacciones";
        this.estado=true;
    }
    ngOnInit(){
        this.getProveedor();
        this.getCodigo();
        this.listUnidades();
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

    onSubmit(id_proveedor:number,recibo:string,tipo:string){
        this.pago= new PagoModel(this.codigo,id_proveedor,recibo,tipo);
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
       
    }
    exitCompra(index){
        this.compras.splice(index,1);
    }
    addDetalles(){
        let pago=this.pagoService;
        let cod= this.codigo;
        this.compras.forEach(function(value){
            let pagoD=new PagoDetalleModel(cod,value.id_producto,value.cantidad,value.id_unidad,value.precio_unitario);
            pago.addPagoDetalle(pagoD).subscribe(
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