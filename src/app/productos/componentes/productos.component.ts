import { Component } from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import {ProductoService} from '../services/producto.service';
import { producto } from '../modelos/productos';
import{categoria} from '../../categorias/modelos/categorias';
import {CategoriaService}from '../../categorias/services/services.categoria';

declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
  selector: 'productos-list',
  templateUrl: '../views/productos.component.html',
  providers: [ProductoService,CategoriaService]
})
export class ProductosComponent{
    public titulo:string;
    public productos:producto;
    public producto:producto;
    public editproducto:producto;
    public agregarpro:producto;
    public cate:categoria;
    public categorias:categoria;
    public modificarcategoria;
    public ident;
    public apareceredit;
    public llamarcategoria;

    public modificarproducto;
	constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _productoservice: ProductoService,
        private _categoriaservice:CategoriaService,
        
    ){
        this.titulo = "productos";
        this.tabla();

        this.producto=new producto(0,'','','','',null);
        this.editproducto=new producto(0,'','','','',null);
        this.agregarpro=new producto(0,'','','','',null);
        this.categorias=new categoria(0,'');
        this.modificarcategoria=null;
        this.llamarcategoria=null;
        this.apareceredit=null;
        this.modificarproducto=null;
        this.ident=null;
        
    }
    ngOnInit(){
        
        this.mostrar();
        this.mostrarcategoria();
        this.confirmaractualizar(this.modificarproducto);
        this.aparecermodificarcategoria(this.modificarcategoria);
        this.llamarcate(this.llamarcategoria,this.apareceredit);
    }  
    aparecermodificarcategoria(id){
        this.modificarcategoria=id;    
        console.log(this.modificarcategoria);
    }

    llamarcate(id,apa){
        this.llamarcategoria=id;
        this.apareceredit=apa;
        console.log(this.llamarcategoria);
    }
    confirmaractualizar(id){
        this.modificarproducto=id;
        console.log(this.modificarproducto );
        if(this.modificarproducto!=null)
        {
            this._productoservice.SeleccionarProducto(this.modificarproducto).subscribe(
                result=>{
                    this.editproducto=result;
                    console.log(result);
                },
                error=>{
                    console.log(<any>error);
                }   
            );
            
        }else{
            console.log(this.modificarproducto );
        }
      
    }

    editarproduto(id){
        //this.productos=new producto(0,'','','','',null);
        id=this.modificarproducto;
        console.log(id);
        console.log(this.modificarproducto);
        this.editproducto.id=id;
        console.log(this.editproducto.id);
        console.log(this.editproducto);
        this._productoservice.Productosupdate(id,this.editproducto).subscribe(
            result=>{
                this.mostrar();
                console.log(result);
                console.log(this.productos);
                this.modificarproducto=null;
                this.mostrar();
                this.tabla();
            },
            error=>{
                console.log(<any>error);               
            }
        );
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
        console.log(this.agregarpro);
        this._productoservice.addproducto(this.agregarpro).subscribe(
            result=>{
                this.mostrar();
                console.log(result);

            },
            error=>{
                console.log(<any>error);
            }

        )

    }
    eliminarproducto(){
        this._productoservice.borrarproducto(this.ident).subscribe(
            result=>{
                this.mostrar();
            },
            error=>{
                console.log(<any>error);
            }
        )
    }

    cancelar(){
        this.ident=null;
        this.modificarproducto=null;
    }


    getexit(){
        this.modificarcategoria=null;
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
    tabla(){
        this.mostrar();
        setTimeout(function(){
            $(function(){
                 $('#mytable').DataTable({
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ]
                 });
            });
        },3000);
    }
    borraralerta(id){
        this.ident=id;
        this.modificarproducto=null;
        console.log(this.ident + '' + this.modificarproducto);
        swal({
            title: "esta seguro",
            text: "despúes de borrar, no se pude recuperar",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.eliminarproducto();
              swal("su producto se borro satisfactoriamente", {
                icon: "success",
              });
            } else {
              
            }
          });
    }

}