import { Component } from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import {ProductoService} from '../services/producto.service';
import { producto } from '../modelos/productos';


@Component({
  selector: 'productos-list',
  templateUrl: '../views/productos.component.html',
  providers: [ProductoService]
})
export class ProductosComponent{
    public titulo:string;
    public productos:producto[];
    public ident;
	constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _productoservice: ProductoService
        
    ){
        this.titulo = "productos";
        this.ident=null;
     
    }
    ngOnInit(){
        this.mostrar();
        this.actualizar(this.ident);
    }  
    actualizar(id){
        this.ident=id;
        console.log(this.ident);
    }
    mostrar(){
        this._productoservice.getProductos().subscribe(
            result=>{
                this.productos=result;
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }   
        );
    }

}