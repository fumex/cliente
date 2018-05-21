import { Component } from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import {ProductoService} from '../services/producto.service';
import { producto } from '../modelos/productos';
import{categoria} from '../../categorias/modelos/categorias';
import {CategoriaService}from '../../categorias/services/services.categoria';


@Component({
  selector: 'productos-list',
  templateUrl: '../views/productos.component.html',
  providers: [ProductoService,CategoriaService]
})
export class ProductosComponent{
    public titulo:string;
    public productos:producto[];
    public producto:producto;
    public cate:categoria;
    public categorias:categoria;
    public modificar;
    public ident;
    public apareceredit;
    public llamarcategoria;
	constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _productoservice: ProductoService,
        private _categoriaservice:CategoriaService,
        
    ){
        this.titulo = "productos";
        this.ident=null;
        this.producto=new producto(0,'','','','',null);
        this.categorias=new categoria(0,'');
        this.modificar=null;
        this.llamarcategoria=null;
        this.apareceredit=null;
    }
    ngOnInit(){
        this.mostrar();
        this.mostrarcategoria();
        this.actualizar(this.ident);
        this.aparecermodificar(this.modificar);
        this.llamarcate(this.llamarcategoria,this.apareceredit);
    }  
    aparecermodificar(id){
        this.modificar=id;
        console.log(this.modificar);
    }
    actualizar(id){
        this.ident=id;
        console.log(this.ident);
    }
    llamarcate(id,apa){
        this.llamarcategoria=id;
        this.apareceredit=apa;
        console.log(this.llamarcategoria);
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
    agregarproducto(){
        this._productoservice.addproducto(this.producto).subscribe(
            result=>{
                this.mostrar();
                console.log(result);

            },
            error=>{
                console.log(<any>error);
            }

        )

    }
    getexit(){
        this.modificar=null;
        this.llamarcategoria=null;
        this.apareceredit=null;
    }
    mostrarcategoria(){
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


}