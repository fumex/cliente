import { Component } from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import {ProductoService} from '../services/producto.service';
import { producto } from '../modelos/productos';


@Component({
  selector: 'productos-add',
  templateUrl: '../views/productos-add.component.html',
  providers: [ProductoService],
  styleUrls: ['../styles/productos.component.css']
})
export class ProductosAddComponent{
    public titulo:string;
    public producto:producto;

	constructor(
        private _productoService:ProductoService,
        private _route:ActivatedRoute,
        private _router:Router
        ){
        this.titulo = "Agregar Productos";
            this.producto=new producto(0,0,'','','',0);

    }
    ngOnInit(){
       
    }
    onSubmit(){
        console.log(this.producto);
        
        this._productoService.addproducto(this.producto).subscribe(
            result=>{
                this._router.navigate(['/admin/productos']);
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }

        )

    }

  
}