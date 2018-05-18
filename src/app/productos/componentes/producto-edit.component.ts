import { Component ,OnInit} from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import {ProductoService} from '../services/producto.service';

import { producto } from '../modelos/productos';
@Component({
    selector: 'productos-edit',
    templateUrl: '../views/productos-add.component.html',
    providers: [ProductoService ],
    styleUrls: ['../styles/productos.component.css']
  })
  
export class ProductosEditComponent{
    public titulo:string;
    public producto:producto;
   
    public insertar:number;


	constructor(
        private _productoService:ProductoService,

        private _route:ActivatedRoute,
        private _router:Router,
        
        ){
            this.producto=new producto(0,'','','','',null);
    }
    ngOnInit(){
        this.getProducto();
       
    }
    getProducto(){ 
        this._route.params.subscribe(params=>{
            let id=+params['id'];
            this._productoService.SeleccionarProducto(id).subscribe(
                response =>{
                    console.log(response);
                    this.producto=response;
                },
                error=>{
                    console.log(<any>error);
                }   
            )
        })
    }


  
}