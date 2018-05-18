import { Component } from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import {ProductoService} from '../services/producto.service';
import {CategoriaService}from '../../categorias/services/services.categoria';
import { producto } from '../modelos/productos';
import {categoria} from '../../categorias/modelos/categorias';
import {ProductosComponent}from './productos.component';

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
    public insertar:number;
	constructor(
        private _productoService:ProductoService,
        private _categoriaservice:CategoriaService,
        private _route:ActivatedRoute,
        private _router:Router,
        private _cargar:ProductosComponent
        ){
        this.titulo = "Agregar Productos";
        this.insertar=0;
        this.producto=new producto(0,'','','','',null);
           
            

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
        //console.log(this.producto);
        this.agregarproducto();
    }

    agregarproducto(){
        this._productoService.addproducto(this.producto).subscribe(
            result=>{
                this._cargar.ngOnInit();
                console.log(result);

            },
            error=>{
                console.log(<any>error);
            }

        )

    }

    selecproducto(iden){
        this._productoService.SeleccionarProducto(iden).subscribe(
            result=>{
                console.log(result);
                    this.producto=result;
            },
            error=>{
                console.log(<any>error);
            }
        )
    }
    CategoriaInsertar(){
        this.cate=new categoria(0,'' );
        this._categoriaservice.addCategoria(this.cate).subscribe(
            result=>{
                this.CategoriaCancelar();
            },
            error=>{
                console.log(<any>error);
            }

        )
    }

    CategoriaCancelar(){
        this.insertar=0;
    }
    ConsultarInsertar(){
        this.insertar=1;
    }
   
}