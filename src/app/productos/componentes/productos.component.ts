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

	constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _productoservice: ProductoService
    ){
        this.titulo = "productos";
    }
    ngOnInit(){
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