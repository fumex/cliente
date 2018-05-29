import { Component } from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import{InventarioService}from '../services/inventario.service'
import{AlmacenesService}from '../../Almacenes/services/almacenes.service';
import{ProductoService} from '../../productos/services/producto.service';
import{inventario} from '../modelos/inventario';
import{almacen}from '../../Almacenes/modelos/almacenes';
import{producto} from '../../productos/modelos/productos';


declare var swal:any;

@Component({
  selector: 'inventario',
  templateUrl: '../views/inventario.component.html',
  providers: [InventarioService,AlmacenesService,ProductoService]
})
export class InventarioComponent{
    public titulo:string;
    public ident;
    public almacenselec;
    public inventarios:inventario[];
    public inventario:inventario;
    public almacenes:almacen;
    public almacene:almacen;
    public productos:producto;
	constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _InventarioService:InventarioService,
        private _almacenesService:AlmacenesService,
        private _ProductoService:ProductoService,
    ){
        this.titulo = "Cardex";
        this.inventario=new inventario(0,'','',0,0,0,0,'',0);
        this.ident=null;
        this.almacenselec=null;

    }

    ngOnInit(){
        this.mostrar();
        this.mostraralmacen();
        this.mostrarProducto();
        this.mostrarveralmacen(this.almacenselec);
    }  
    cambio(id){
        this.almacenselec=id;
        console.log(this.almacenselec);
        this.mostrarveralmacen(this.almacenselec);
    }
    mostrarveralmacen(almacenselec){
        this._almacenesService.veralmacen(this.almacenselec).subscribe(
            response => {
                this.almacene = response;
                console.log(response);
            },
            error => {
                console.log(<any>error);
                }
            );
    }
    actualizar(id){
        this.ident=id;
        console.log(this.almacenselec);
        
    }

    mostrar(){
        this.limpiar();
        this._InventarioService.getInventario().subscribe(
            result=>{
                this.inventarios=result;
                //console.log(result);
            },
            error=>{
                console.log(<any>error);
            }   
        );

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

    mostrarProducto(){
    this._ProductoService.getProductos().subscribe(
        result=>{
            this.productos=result;
            //console.log(result);
         },
         error=>{
             console.log(<any>error);
        }   
        );
    }
    limpiar(){
        this.inventario=new inventario(0,'','',0,0,0,0,'',0);
    }
    agregarinventario(){
        console.log(this.inventario);
        this._InventarioService.addInventario(this.inventario).subscribe(
            result=>{
                this.mostrar();
                console.log(result);
                this.almacenselec=null;
            },
            error=>{
                console.log(<any>error);
            }

        )

    }
    iralmacen(){
        this._router.navigate(['/admin/almacenes']);
    }
    irproducto(){
        this._router.navigate(['/admin/productos']);
    }
    
}