import { Component } from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import {ProductoService} from '../services/producto.service';
import {CategoriaService}from '../../categorias/services/services.categoria';
import { producto } from '../modelos/productos';
import {categoria} from '../../categorias/modelos/categorias';



@Component({
  selector: 'productos-add',
  templateUrl: '../views/productos-add.component.html',
  providers: [ProductoService , CategoriaService],
  styleUrls: ['../styles/productos.component.css']
})
export class ProductosAddComponent{
    public titulo:string;
    public producto:producto;
    public cate:categoria;
	constructor(
        private _productoService:ProductoService,
        private _categoriaservice:CategoriaService,
        private _route:ActivatedRoute,
        private _router:Router
        ){
        this.titulo = "Agregar Productos";
            this.producto=new producto(0,0,'','','',0);
            

    }
    ngOnInit(){
        this._categoriaservice.getCategoria().subscribe(
            result=>{
                this.cate=result;
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }   
        );
       
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