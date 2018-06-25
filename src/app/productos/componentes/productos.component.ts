import { Component ,ViewContainerRef } from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import {ProductoService} from '../services/producto.service';
import { producto } from '../modelos/productos';
import { UnidadesModel } from '../modelos/unidades';
import{categoria} from '../../categorias/modelos/categorias';
import {CategoriaService}from '../../categorias/services/services.categoria';
import { UnidadService } from '../services/unidad.service';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/interfaces/user.model';

import {ToastService} from '../../toastalert/service/toasts.service'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


declare var jQuery:any;
declare var $:any;
declare var swal:any;


@Component({
  selector: 'productos-add',
  templateUrl: '../views/productos.component.html',
  providers: [ProductoService,CategoriaService,UnidadService,ToastService],

})
export class ProductosComponent{
    public titulo:string;
    public productos:producto;
    public producto:producto;
    public editproducto:producto;
    public agregarpro:producto;
    public cate:categoria;
    public categorias:categoria;
    public unidadmodelo:UnidadesModel;
    public modificarcategoria;
    public modificarunidad;
    public ident;
    public aparecereditcate;
    public aparecereditunidad;
    public llamarcategoria;
    public llamarunidad;
    public unidad;
    public modificarproducto;
    public user:User;
    public nombre;
    public descripcion;
    public selectunidad;
    public cantidad ;
	constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _productoservice: ProductoService,
        private _categoriaservice:CategoriaService,
        private _UnidadService:UnidadService,
        private auth:AuthService,
        private toaste:ToastService,
        public toastr: ToastsManager,
        vcr: ViewContainerRef

    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.titulo = "productos";
        this.tabla();
        this.user=this.auth.getUser();
        this.producto=new producto(0,null,'','','',null,this.user.id,null);
        this.editproducto=new producto(0,null,'','','',null,this.user.id,null);
        this.agregarpro=new producto(0,null,'','','',null,this.user.id,null);
        this.categorias=new categoria(0,'',this.user.id);
        //this.unidadmodelo=new UnidadesModel(0,'','');

        this.modificarcategoria=null;
        this.llamarcategoria=null;
        this.aparecereditcate=null;

        this.modificarunidad=null;
        this.llamarunidad=null;
        this.aparecereditunidad=null;
        
        this.modificarproducto=null;
        this.ident=null;
        this.unidad=null;
    }

    ngOnInit(){
        this.mostrar();
        this.mostrarcategoria();
        this.mostarunidad();
        this.confirmaractualizar(this.modificarproducto);
        this.aparecermodificarcategoria(this.modificarcategoria);
        this.llamarcate(this.llamarcategoria,this.aparecereditcate);
    } 
    aparecerunidad(id){
        this.unidad=id;
        console.log(this.unidad);
    } 
    aparecermodificarcategoria(id){
        this.modificarcategoria=id;    
        //console.log(this.modificarcategoria);
    }

    llamarcate(id,apa){
        this.llamarcategoria=id;
        this.aparecereditcate=apa;
        console.log(this.llamarcategoria);
    }
    llamarunid(id,apa){
        this.llamarunidad=id;
        this.aparecereditunidad=apa;
        console.log(this.llamarunidad);
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
        let nombre =document.getElementById('firstName');
        //this.productos=new producto(0,'','','','',null);
        id=this.modificarproducto;
        console.log(id);
        console.log(this.modificarproducto);
        this.editproducto.id=id;
        console.log(this.editproducto.id);
        console.log(this.editproducto);
        this._productoservice.Productosupdate(id,this.editproducto).subscribe(
            result=>{
                this.limpiar();
                this.destruir();
                this.reconstruir();
                console.log(result);
                console.log(this.productos);
                this.modificarproducto=null;
                this.modificaralerta();
            },
            error=>{
                console.log(<any>error);   
                if(error.status==500){
                    let text="ocurio un error insertando el producto";
                    this.toaste.errorAlerta(text,'Error!(es posible que el producto ya exista)');
                    nombre.focus();
                }            
            }
        );
    }
   
    limpiar(){
        this.modificarcategoria=null;
        this.llamarcategoria=null;
        this.aparecereditcate=null;

        this.modificarunidad=null;
        this.llamarunidad=null;
        this.aparecereditunidad=null;
        
        this.modificarproducto=null;
        this.ident=null;
        this.unidad=null;

        this.editproducto=new producto(0,null,'','','',null,this.user.id,null);
        this.agregarpro=new producto(0,null,'','','',null,this.user.id,null);
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
        let nombre =document.getElementById('firstName');
        this._productoservice.addproducto(this.agregarpro).subscribe(
            result=>{
                console.log(result);
                
                this.limpiar();
                this.modificaralerta();
                this.destruir();
                this.reconstruir();
                this.unidad=null;
                nombre.focus();
            },
            error=>{
                console.log(<any>error);
                if(error.status==500){
                    let text="ocurio un error insertando el producto";
                    this.toaste.errorAlerta(text,'Error!(es posible que el producto ya exista)');
                    nombre.focus();
                } 
            }

        )

    }
    eliminarproducto(){
        this._productoservice.borrarproducto(this.ident).subscribe(
            result=>{
                this.destruir();
                this.reconstruir();
            },
            error=>{
                console.log(<any>error);
            }
        )
    }

    cancelar(){
        this.limpiar();
    }


    getexitcate(){
        this.modificarcategoria=null;
        this.llamarcategoria=null;
        this.aparecereditcate=null;
        this.agregarpro.id_categoria=null;
    }
    getexituni(){
        this.llamarunidad=null;
        this.modificarunidad=null;
        this.unidad=null;
        this.aparecereditunidad=null;
        this.agregarpro.id_unidad=null;
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
    mostarunidad(){
        this._UnidadService.getunidad().subscribe(
            result=>{
                this.unidadmodelo=result;
                console.log(this.unidadmodelo);
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
                buttons: false,
                timer: 3000
              });
            } else {
              
            }
          });
    }
    destruir(){	
        var table = $('#mytable').DataTable(); table .clear() ;
        $('#mytable').DataTable().destroy();
    }
    reconstruir(){
        this.tabla();
        this.mostrar();
    }
    modificaralerta(){
        swal({
            position: 'center',
            icon: "success",
            title: 'se guardo el almacen',
            buttons: false,
            timer: 3000
          })
    }
    agregaralerta(){
        swal({
            position: 'center',
            icon: "success",
            title: 'se guardo el almacen',
            buttons: false,
            timer: 3000
          })
    }
    
    showSuccess() {
        
      }
}