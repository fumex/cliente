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

import {ImpuestoService} from '../../impuesto/services/impuesto.service';
import {ImpuestoModel} from '../../impuesto/models/impuesto'

import { detalleimpuestoservice} from '../../detalle_impuesto/services/detalle_impuesto.service';
import { DetalleImpuestoModel} from '../../detalle_impuesto/models/detalle_impuesto';

import {ToastService} from '../../toastalert/service/toasts.service'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { environment } from '../../../environments/environment';


declare var jQuery:any;
declare var $:any;
declare var swal:any;


@Component({
  selector: 'productos-add',
  templateUrl: '../views/productos.component.html',
  providers: [ProductoService,CategoriaService,UnidadService,ToastService,ImpuestoService,detalleimpuestoservice],

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

    public impuestoigv:any=[];
    public impuestrootro:Array<ImpuestoModel>=[];
    public impuestroeditotro:Array<ImpuestoModel>=[];

    public detalleimpu:DetalleImpuestoModel;
    public detalleimpuesotro:DetalleImpuestoModel;
    public detalleimpuesigv:DetalleImpuestoModel;

    public detalleimpuestoigv:Array<DetalleImpuestoModel>=[];
    public detalleimpuestootro:Array<DetalleImpuestoModel>=[];

    public editigv:DetalleImpuestoModel;
    public editotro:DetalleImpuestoModel;
    public editarimpuestoigv:Array<DetalleImpuestoModel>=[];
    public editarimpuestootro:Array<DetalleImpuestoModel>=[];

    public otro:any;
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
    public filesToUpload:File[];
    public filesToEdit:File[];
    public text;
    public mostratablaotros;


    public url;
    public ruta;
    public filear;
    public res:any;
    imageUrl: string = "assets/images/1.png";
    imageedit: string = "assets/images/1.png";
    fileToUpload:File = null;


	constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _productoservice: ProductoService,
        private _categoriaservice:CategoriaService,
        private _UnidadService:UnidadService,
        private _ImpuestoService:ImpuestoService,
        
        private _detalleimpuestoservice:detalleimpuestoservice,
        private auth:AuthService,
        private toaste:ToastService,
        public toastr: ToastsManager,
        vcr: ViewContainerRef

    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.titulo = "productos";
        this.user=this.auth.getUser();
        this.producto=new producto(0,null,'','','',null,this.user.id,null,null);
        this.editproducto=new producto(0,null,'','','',null,this.user.id,null,null);
        this.agregarpro=new producto(0,null,'','','',null,this.user.id,null,null);
        this.categorias=new categoria(0,'',this.user.id);
        this.detalleimpu=new DetalleImpuestoModel(null,null,null,null);

        this.detalleimpuesotro=new DetalleImpuestoModel(null,null,null,null);
        this.detalleimpuesigv=new DetalleImpuestoModel(null,null,null,null);

        this.editigv=new DetalleImpuestoModel(null,null,null,null);
        this.editotro=new DetalleImpuestoModel(null,null,null,null);
        this.modificarcategoria=null;
        this.llamarcategoria=null;
        this.aparecereditcate=null;

        this.modificarunidad=null;
        this.llamarunidad=null;
        this.aparecereditunidad=null;
        
        this.modificarproducto=null;
        this.ident=null;
        this.unidad=null;
        this.url=environment.api_url; 
        this.filesToUpload=null;  
        this.filesToEdit=null;
        this.imageUrl=this.url+'/imagenesproductos/2.jpg';
        this.imageedit=this.url+'/imagenesproductos/2.jpg';

        this.tabla();

       this.mostratablaotros=null;

    }

    ngOnInit(){
       
        this.getIgv();
        this.mostrar();

        this.mostrarcategoria(0);
        this.mostarunidad();
       
        this.aparecermodificarcategoria(this.modificarcategoria);
        this.llamarcate(this.llamarcategoria,this.aparecereditcate);
    } 
    agregardetalleimpuestoigv(id_impu){
        let indice=0;
        if(this.detalleimpuestoigv.length>0){
            console.log('entro');
            this.detalleimpuestoigv.splice(0,1);
        }
        this.detalleimpuestoigv.push(this.detalleimpu);
        console.log(this.detalleimpuestoigv);

    }
    agregardetalleimpuestootro(index,id){
        this.impuestrootro[index].id=null;
        this.detalleimpuesotro.id=index;
        this.detalleimpuesotro.id_impuesto=id;
        this.detalleimpuestootro.push(this.detalleimpuesotro);
        this.detalleimpuesotro=new DetalleImpuestoModel(null,null,null,null);
        console.log(this.detalleimpuestootro);
    }
    quitardetalleimpuestootro(index){
        let indice=0;
        while(indice<this.detalleimpuestootro.length){
            if(this.detalleimpuestootro[indice].id===index)
            {
                this.impuestrootro[index].id=this.detalleimpuestootro[indice].id_impuesto;
                this.detalleimpuestootro.splice(indice,1);
            }
            indice=indice+1;
        }
        console.log(this.detalleimpuestootro);
    }
    mostarriname(file: FileList,fileInput: any){
        this.filear=document.getElementById('image');
        var filePath = this.filear.value;
        var allowedExtensions = /(.jpg|.jpeg|.png)$/i;
       
        if(!this.filear.value){

            this.filesToUpload=null;
        }else{
            if(file[0].size> 2000000){
                this.toaste.WarningAlert('el archivo es mas grande de lo permitido (2MB)','Error!');
                this.filesToUpload=null;
                this.filear.value="";
            }else{
                if(!allowedExtensions.exec(filePath)){
                    this.toaste.WarningAlert('el archivo no tiene la extencion correcta (jpg,png,jpeg)','Error!');
                    this.filesToUpload=null;
                    this.filear.value="";
                    return false;
                }else{
                    console.log('entro');
                    this.filesToUpload = fileInput.target.files;
                    this.fileToUpload = file.item(0);
                    var reader = new FileReader();
                    reader.onload = (event:any) => {
                    this.imageUrl = event.target.result;
                    }

                    reader.readAsDataURL(this.fileToUpload);
                }
            }
        }
    }
    
    editarimagen(file: FileList,fileInput: any){
        this.filear=document.getElementById('imageeditar');
        var filePath = this.filear.value;

        var allowedExtensions = /(.jpg|.jpeg|.png)$/i;
       
        if(!this.filear.value){
            this.filesToEdit=null;
        }else{
            if(file[0].size> 2000000){
                this.toaste.WarningAlert('el archivo es mas grande de lo permitido (2MB)','Error!');
                this.filesToEdit=null;
                this.filear.value="";
            }else{
                if(!allowedExtensions.exec(filePath)){
                    this.toaste.WarningAlert('el archivo no tiene la extencion correcta (jpg,png,jpeg)','Error!');
                    this.filesToEdit=null;
                    this.filear.value="";
                    return false;
                }else{
                    console.log('entro');
                    this.filesToEdit = fileInput.target.files;
                    this.fileToUpload = file.item(0);
                    var reader = new FileReader();
                    reader.onload = (event:any) => {
                    this.imageedit = event.target.result;
                    }

                    reader.readAsDataURL(this.fileToUpload);
                }
            }
        }
    }
    mostratablaimpuestos(){
        this.tablaimpuestos();
        this.getotro();
        this.mostratablaotros=1;
    }
    isertarimagen(nombre){
        nombre=this.agregarpro.nombre_producto;  
        
        if(this.filesToUpload==null){
            this.agregarpro.imagen='2.jpg';
            this.agregarproducto();
        }else{
            this._productoservice.insertariamgen(this.filesToUpload).subscribe(
                respuesta=>{
                    
                    this.res=respuesta;
                    console.log(this.res);
                    if(this.res.code==200){
                        this.imageUrl=this.url+'/imagenesproductos/2.jpg';
                        this.agregarpro.imagen=this.res.name+'.'+this.res.extencion;
                        this.agregarproducto();

                    }
                },
                error=>{
                    console.log(<any>error);
                }
            );  
        }
           
    }
    insertardetalleimpuesto(resimpu){
        this._detalleimpuestoservice.detalleimpuestosadd(resimpu).subscribe(
            res=>{

            },
            err=>{
                console.log(err);
            }
        );
    }
    insertarigv(){

        this.insertardetalleimpuesto(this.detalleimpuestoigv[0]);
    }
    insertarotro(){
        let indice=0;
        while(indice<this.detalleimpuestootro.length){

            this.insertardetalleimpuesto(this.detalleimpuestootro[indice])
            indice=indice+1;
        }
    }
    insertareditimage(id){
        if(this.filesToEdit==null){
            this.editarproduto(id);
        }else{
            this._productoservice.insertariamgen(this.filesToEdit).subscribe(
                respuesta=>{
                    this.res=respuesta;
                    if(this.res.code==200){
                        this.imageUrl=this.url+'/imagenesproductos/2.jpg';
                        this.editproducto.imagen=this.res.name+'.'+this.res.extencion;
                        this.editarproduto(id);

                    }
                },
                error=>{
                    console.log(<any>error);
                }
            );  
        }
           
    }
    getimage(name){
        this.imageUrl=this.url+'/imagenesproductos/'+name;
        console.log('get'+name);
    }
    getIgv(){
        this._ImpuestoService.getigv().subscribe(
            res=>{
                this.impuestoigv=Object.values(res);
                console.log(this.impuestoigv);
            },
            err=>{
                console.log(<any>err)
            }
        );
    }
    getotro(){
        this._ImpuestoService.getotro().subscribe(
            res=>{
                this.impuestrootro=res;
                console.log(res);
            },
            err=>{
                console.log(<any>err)
            }
        );
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
        this.titulo='editar producto';
        this.modificarproducto=id;
        
        if(this.modificarproducto!=null)
        {
            this.traerimpuestosotro(id);
            this.treerimpuestosigv(id);
            this._productoservice.SeleccionarProducto(this.modificarproducto).subscribe(
                result=>{
                    this.editproducto=result;
                    console.log(result);
                    this.imageedit=this.url+'/imagenesproductos/'+this.editproducto.imagen;
                    this.geteditotro();
                    
                },
                error=>{
                    console.log(<any>error);
                }   
                
            );
            
        }else{
            console.log(this.modificarproducto );
        }
      
    }
    geteditotro(){
        let indice=0;
        let indice2=0;
        this._ImpuestoService.getotro().subscribe(
            res=>{
                this.impuestroeditotro=res;
                
                console.log(this.impuestroeditotro.length)

                while(indice<this.impuestroeditotro.length){
                    while(indice2<this.editarimpuestootro.length){
                        if(this.impuestroeditotro[indice].id===this.editarimpuestootro[indice2].id_impuesto){
                            
                            this.editarimpuestootro[indice2].id= indice;
                            this.impuestroeditotro[indice].id=null;
                        }
                        indice2=indice2+1;
                    }
                    indice2=0;
                    indice=indice+1;
                }
                console.log( this.impuestroeditotro)
                console.log(this.editarimpuestootro)
            },
            err=>{
                console.log(<any>err)
            }
        );
    }
    traerimpuestosotro(id){
        let indice=0;
   
        this._detalleimpuestoservice.seleccionardetealleotro(id).subscribe(
            res=>{
                this.editotro=res;

                while(indice<res.length){
                    this.editarimpuestootro.push(this.editotro[indice])
                    indice=indice+1;
                }
                console.log(this.editarimpuestootro.length);
            },
            err=>{
                console.log(err)
            }
        );
    }
    agregardetalleotro(index,id){
        console.log(index+','+id);
        let indice=0;
        let repe=0;
        this.impuestroeditotro[index].id=null;
        while(indice<this.editarimpuestootro.length){
            console.log(indice);
            if(this.editarimpuestootro[indice].id_impuesto===id){
                console.log('entro');
                this.editarimpuestootro[indice].estado=true;
                repe=1;
            }
            indice=indice+1;
        }
       
        if(repe===0){
            console.log(repe);
            this.detalleimpuesotro.id=index;
            this.detalleimpuesotro.id_impuesto=id;
            this.detalleimpuesotro.id_producto=this.modificarproducto;
            this.detalleimpuesotro.estado=true;
            this.editarimpuestootro.push(this.detalleimpuesotro);
            this.detalleimpuesotro=new DetalleImpuestoModel(null,null,null,null);
        }
       
        
        console.log(this.editarimpuestootro);
    }
    quitardetalleotro(index){
        
        console.log(index);
        let indice=0;

        while(indice<this.editarimpuestootro.length){
            if(this.editarimpuestootro[indice].id==index){
                this.impuestroeditotro[index].id=this.editarimpuestootro[indice].id_impuesto;
                this.editarimpuestootro[indice].estado=false;

            }

            indice=indice+1;
        }
        indice=0;
        console.log(this.editarimpuestootro);
        console.log(this.impuestroeditotro);
    }
    modificaciondelotro(){
        let indice=0;
        while(indice<this.editarimpuestootro.length){
            this._detalleimpuestoservice.detalleimpuestoseditotro(this.editarimpuestootro[indice]).subscribe(
                res=>{
                    console.log(res)
                },
                err=>{
                    console.log(<any>err);
                }
            );

            indice=indice+1;
        }
    }
    limpiarediciondelotro(){
        this.editigv=new DetalleImpuestoModel(null,null,null,null);
        let indice=0;
        while(indice<this.editarimpuestootro.length){
            this.editarimpuestootro.splice(0,1)
        }
    }
    treerimpuestosigv(id){
        this._detalleimpuestoservice.seleccionardetealleigv(id).subscribe(
            res=>{
                
                this.editigv=res[0];
                this.editarimpuestoigv.push(res[0])
               console.log(this.editarimpuestoigv)
            },
            err=>{
                console.log(err)
            }
        );
    }
    ediciondeligv(id){
        this.editarimpuestoigv.splice(0,1);
        this.detalleimpuesigv.id_impuesto=id;
        this.detalleimpuesigv.id_producto=this.modificarproducto;
        this.detalleimpuesigv.estado=true;
        this.editarimpuestoigv.push(this.editigv);
        console.log(this.editarimpuestoigv)
        this.detalleimpuesigv=new DetalleImpuestoModel(null,null,null,null);
    }
    modificaciondeligv(){
        this._detalleimpuestoservice.detalleimpuestoseditigv(this.editarimpuestoigv[0]).subscribe(
            res=>{
                console.log(res);
            },
            err=>{
                console.log(<any>err);
            }

        );
    }
    limpiarediciondeligv(){
        this.editigv=new DetalleImpuestoModel(null,null,null,null);
        let indice=0;
        while(indice<this.editarimpuestoigv.length){
            this.editarimpuestoigv.splice(0,1)
        }
    }
    editarproduto(id){
        this.nombre =document.getElementById('firstName');
        //this.productos=new producto(0,'','','','',null);
        id=this.modificarproducto;
        console.log(id);
        console.log(this.modificarproducto);
        this.editproducto.id=id;
        console.log(this.editproducto.id);
        console.log(this.editproducto);
        this._productoservice.Productosupdate(id,this.editproducto).subscribe(
            result=>{
                this.nombre.focus();
                console.log(result);
                if(result.code===300){
                    let text="el Producto ya existe";
                    this.toaste.errorAlerta(text,'Error!');
                    this.nombre.select();
                }else{
                    if(result.code===200){
                        this.modificaciondeligv();
                        this.modificaciondelotro();
                        this.limpiar();
                        this.reconstruir();
                        this.modificarproducto=null;
                        this.modificaralerta();
                    }
                } 
            },
            error=>{
                console.log(<any>error);   
                if(error.status==500){
                    
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

        this.editproducto=new producto(0,null,'','','',null,this.user.id,null,null);
        this.agregarpro=new producto(0,null,'','','',null,this.user.id,null,null);

        this.detalleimpu=new DetalleImpuestoModel(null,null,null,null);

        this.detalleimpuesotro=new DetalleImpuestoModel(null,null,null,null);
        this.detalleimpuesigv=new DetalleImpuestoModel(null,null,null,null);


        this.editotro=new DetalleImpuestoModel(null,null,null,null);

       
        this.limpiartablaimpuestos();
        this.limpiarediciondeligv();
        this.limpiarediciondelotro();

        if(this.detalleimpuestoigv.length>0){
            console.log('entro');
            this.detalleimpuestoigv.splice(0,1);
        }
        this.detalleimpu=new DetalleImpuestoModel(null,null,null,null);

        if(this.filesToUpload!=null){
            this.filesToUpload=null;
            this.filear=document.getElementById('image');
            this.filear.value=null;
            
        }
        this.imageUrl=this.url+'/imagenesproductos/2.jpg';

        this.mostratablaotros=null;
    }
    limpiartablaimpuestos(){

        let indice=0;
        let indice2=0;
        
        while(indice<this.detalleimpuestootro.length){
           
            while(indice2<this.impuestrootro.length){
                if(this.detalleimpuestootro[indice].id===indice2){
                    this.impuestrootro[indice2].id=this.detalleimpuestootro[indice].id_impuesto;
                }
                indice2=indice2 + 1; 
            }
            indice2=0;  
            indice=indice+1;
        }
        indice=0;
        while(indice<this.detalleimpuestootro.length){

            this.detalleimpuestootro.splice(0,1);
        }
        console.log(this.detalleimpuestootro);
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
        this.nombre =document.getElementById('firstName');
        this._productoservice.addproducto(this.agregarpro).subscribe(
            result=>{
                console.log(result);
                this.nombre.focus();
                if(result.code==300){
                    let text="el Producto ya existe";
                    this.toaste.errorAlerta(text,'Error!');
                    this.nombre.select();
                }else{
                    if(result.code==200){
                        this.insertarigv();
                        this.insertarotro();
                        this.limpiar();
                        this.agregaralerta();
                        this.destruir();
                        this.reconstruir();
                        this.unidad=null;
                    }
                }
                
                
            },
            error=>{
                console.log(<any>error);
                if(error.status==500){
                    
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
        this.reconstruir();
        this.titulo = "productos";
    }


    getexitcate(){
        
        this.modificarcategoria=null;
        this.llamarcategoria=null;
        this.aparecereditcate=null;
        //this.agregarpro.id_categoria=null;
        
    }
    getexituni(){
        this.llamarunidad=null;
        this.modificarunidad=null;
        this.unidad=null;
        this.aparecereditunidad=null;
        this.agregarpro.id_unidad=null;
    }
    mostrarcategoria(code){
        
        this._categoriaservice.getCategoria().subscribe(
            result=>{
                this.cate=result;
                
               
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

    tablaimpuestos(){
        setTimeout(function(){
            $(function(){
                 $('#tablaimpuesto').DataTable();
            });
        },3000);
    }

    aralerta(id){
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
        this.mostrar();
        this.tabla();
       
    }
    destruirimpuesto(){	
        var table = $('#tablaimpuesto').DataTable(); table .clear() ;
        $('#tablaimpuesto').DataTable().destroy();
    }
    reconstruirimpuesto(){
        this.tablaimpuestos();
        this.getotro();
    }
    modificaralerta(){
        swal({
            position: 'center',
            icon: "success",
            title: 'se guardo el Producto',
            buttons: false,
            timer: 3000
          })
    }
    agregaralerta(){
        swal({
            position: 'center',
            icon: "success",
            title: 'se guardo el Producto',
            buttons: false,
            timer: 3000
          })
    }
    
}