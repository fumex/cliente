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
import { UsuarioService } from '../../usuarios/services/usuarios.service';
import { PermisosRolesModel } from '../../usuarios/modelos/permisos_roles';


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
    public impuestroisc:Array<any>=[];
    public impuestroeditotro:Array<ImpuestoModel>=[];
    public impuestroeditisc:Array<ImpuestoModel>=[];

    public detalleimpu:DetalleImpuestoModel;
    public detalleimpuesotro:DetalleImpuestoModel;
    public detalleimpuesisc:DetalleImpuestoModel;
    public detalleimpuesigv:DetalleImpuestoModel;

    public detalleimpuestoigv:Array<DetalleImpuestoModel>=[];
    public detalleimpuestootro:Array<DetalleImpuestoModel>=[];
    //public detalleimpuestoisc:Array<DetalleImpuestoModel>=[];

    public editigv:DetalleImpuestoModel;
    public editotro:DetalleImpuestoModel;
    public editisc:DetalleImpuestoModel;

    public editarimpuestoigv:Array<DetalleImpuestoModel>=[];
    public editarimpuestootro:Array<DetalleImpuestoModel>=[];
    public editarimpuestoisc:Array<DetalleImpuestoModel>=[];

    public otro:any;
    public modificarcategoria;
    public modificarunidad;
    public ident;
    public aparecereditcate;
    public llamarcategoria;
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
    public mostrarrestodatos=null;

    public url;
    public ruta;
    public filear;
    public res:any;
    imageUrl: string = "assets/images/1.png";
    imageedit: string = "assets/images/1.png";
    fileToUpload:File = null;
    public url2;
    public veradd=null;
    public veredit=null;
    public verdelete=null;
    public mandar:PermisosRolesModel;

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
        vcr: ViewContainerRef,
        private _UsuarioService:UsuarioService,

    ){
        this.url2=environment.url+'admin/productos';
        this.user=this.auth.getUser();
        this.mandar = new PermisosRolesModel(this.user.id,null,this.url2,null,null);
        let i=0;
        this._UsuarioService.getpermisos(this.mandar).subscribe(
            res=>{
                console.log(res)
                if(res.mensaje!=false){
                    this.veradd=true;
                    this.veredit=true;
                    this.verdelete=true;
                }else{
                    if(res.mensaje!=false){
                        while(i<res.length){
                            if(res[i].tipo_permiso=="insercion" && res[i].estado==true){
                                this.veradd=true;
                            }
                            if(res[i].tipo_permiso=="edicion" && res[i].estado==true){
                                this.veredit=true;
                            }
                            if(res[i].tipo_permiso=="anulacion" && res[i].estado==true){
                                this.verdelete=true;
                            }
                            i++
                        }
                    }else{
                        this._router.navigate(['/'+this.user.rol]);
                    }
                }
                
            },
            err=>{
                console.log(<any>err);
            }
        )
        this.toastr.setRootViewContainerRef(vcr);
        this.titulo = "productos";
        this.user=this.auth.getUser();
        this.producto=new producto(0,null,'','','',null,this.user.id,null,null,null,null,null); 
        this.editproducto=new producto(0,null,'','','',null,this.user.id,null,null,null,null,null);
        this.agregarpro=new producto(0,null,'','','',null,this.user.id,null,null,null,null,null);
        this.categorias=new categoria(0,'',this.user.id);
        this.detalleimpu=new DetalleImpuestoModel(null,null,null,null);

        this.detalleimpuesotro=new DetalleImpuestoModel(null,null,null,null);
        this.detalleimpuesigv=new DetalleImpuestoModel(null,null,null,null);
        this.detalleimpuesisc=new DetalleImpuestoModel(null,null,null,null);

        this.editigv=new DetalleImpuestoModel(null,null,null,null);
        this.editotro=new DetalleImpuestoModel(null,null,null,null);
        this.editisc=new DetalleImpuestoModel(null,null,null,null);
        this.modificarcategoria=null;
        this.llamarcategoria=null;
        this.aparecereditcate=null;

        this.modificarunidad=null;
        
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
        this.getotro();
        this.getIgv();
        this.mostrar();
        this.getisc();

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
    agregardetalleimpuestoisc(indice,id){
        let i=0;
        this.detalleimpuesisc.id_impuesto=id;
        while(i<this.impuestroisc.length){
            if(this.impuestroisc[i].descripcion==null){
                this.impuestroisc[i].descripcion="acepted";    
            }
            i++;
        }
        this.impuestroisc[indice].descripcion=null; 
        console.log(this.detalleimpuesisc);
        console.log(this.impuestroisc);
    }
    quitardetalleimpuestoisc(indice){
        this.detalleimpuesisc.id_impuesto=null;
        this.impuestroisc[indice].descripcion="acepted";   
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
        this.mostratablaotros=1;
    }
    ocultartablaimpuestos(){
        this.mostratablaotros=null;
    }
    mostrarotrasdescripciones(){
        this.mostrarrestodatos=1;
    }
    ocultarotrasdescripciones(){
        this.mostrarrestodatos=null;
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
    insertarisc(){
        console.log(this.detalleimpuesisc);
        this.insertardetalleimpuesto(this.detalleimpuesisc)
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
    getisc(){
        this._ImpuestoService.getisc().subscribe(
            res=>{
                this.impuestroisc=res;
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
    confirmaractualizar(id){
        this.titulo='editar producto';
        this.modificarproducto=id;
        
        if(this.modificarproducto!=null)
        {
            this.traerimpuestosotro(id);
            this.treerimpuestosigv(id);
            this.traerimpuestosisc(id);
            this._productoservice.SeleccionarProducto(this.modificarproducto).subscribe(
                result=>{
                    this.editproducto=result;
                    console.log(result);
                    this.imageedit=this.url+'/imagenesproductos/'+this.editproducto.imagen;
                    this.geteditotro();
                    this.geteditisc();
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
    geteditisc(){
        let i=0;
        this._ImpuestoService.getisc().subscribe(
            res=>{
                this.impuestroeditisc=res;
                console.log(this.impuestroeditisc.length)
                
                while(i<this.impuestroeditisc.length){
                    if(this.impuestroeditisc[i].id==this.editisc.id_impuesto){
                        console.log("entro");
                        this.impuestroeditisc[i].descripcion=null;
                    }
                    i++;
                }
                console.log(this.impuestroeditisc)

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
            },
            err=>{
                console.log(err)
            }
        );
    }
    traerimpuestosisc(id){
        this._detalleimpuestoservice.seleccionardetealleisc(id).subscribe(
            res=>{
                this.editisc=res;
                console.log(this.editisc);
            },
            err=>{
                console.log(err)
            }
        );
    }
    agregardetalleotro(index,id){
        let indice=0;
        let repe=0;
        this.impuestroeditotro[index].id=null;
        while(indice<this.editarimpuestootro.length){
            if(this.editarimpuestootro[indice].id_impuesto===id){
                this.editarimpuestootro[indice].estado=true;
                repe=1;
            }
            indice=indice+1;
        }
       
        if(repe===0){
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
    agregardetalleisc(indice,id){
        let i=0,j=0,validar=null;
        while(i<this.impuestroeditisc.length){
            
            if(this.impuestroeditisc[i].descripcion==null){
                this.impuestroeditisc[i].descripcion="acepted"
                while(j<this.editarimpuestoisc.length){
                    if(this.impuestroisc[i].id==this.editarimpuestoisc[j].id_impuesto){
                        validar=j;
                    }
                    j++;
                }
                j=0;
                if(validar!=null){
                    this.editarimpuestoisc[validar].estado=false;
                }else{
                    this.detalleimpuesisc.id_impuesto=this.impuestroisc[i].id;
                    this.detalleimpuesisc.id_producto=this.modificarproducto;
                    this.detalleimpuesisc.estado=false;
                    this.editarimpuestoisc.push(this.detalleimpuesisc)
                    this.detalleimpuesisc=new DetalleImpuestoModel(null,null,null,null);
                }
                validar=null;
            }
            
            i++;
        }
        this.impuestroeditisc[indice].descripcion=null;
        while(j<this.editarimpuestoisc.length){
            if(this.editarimpuestoisc[j].id_impuesto==id){
                validar=j;
            }
            j++;
        }

        if(validar!=null){
            this.editarimpuestoisc[validar].estado=true
        }else{
            this.detalleimpuesisc.id_impuesto=id;
            this.detalleimpuesisc.id_producto=this.modificarproducto;
            this.detalleimpuesisc.estado=true;
            this.editarimpuestoisc.push(this.detalleimpuesisc)
            this.detalleimpuesisc=new DetalleImpuestoModel(null,null,null,null);
        }
        console.log(this.editarimpuestoisc);
    }
    quitardetalleisc(indice){
        let i=0,validar=null;
        this.impuestroeditisc[indice].descripcion="acepted";
        while(i<this.editarimpuestoisc.length){
            if(this.editarimpuestoisc[i].id_impuesto==this.impuestroisc[indice].id){
                validar=i;
            }
            i++;
        }
        if(validar!=null){
            this.editarimpuestoisc[validar].estado=false;
        }else{
            this.detalleimpuesisc.id_impuesto=this.impuestroisc[indice].id;
            this.detalleimpuesisc.id_producto=this.modificarproducto;
            this.detalleimpuesisc.estado=false;
            this.editarimpuestoisc.push(this.detalleimpuesisc)
            this.detalleimpuesisc=new DetalleImpuestoModel(null,null,null,null);
        }
        console.log(this.editarimpuestoisc);
    }
    modificaciondelisc(){ 
        let indice=0;
        console.log(this.editarimpuestoisc);
        while(indice<this.editarimpuestoisc.length){
            this._detalleimpuestoservice.detalleimpuestoseditotro(this.editarimpuestoisc[indice]).subscribe(
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
    modificaciondelotro(){
        let indice=0;
        console.log(this.editarimpuestootro)
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
        console.log(this.editarimpuestoigv)
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
    limpiarediciondelisc(){
        this.editisc=new DetalleImpuestoModel(null,null,null,null);
        let indice=0;
        while(0<this.editarimpuestoisc.length){
            this.editarimpuestoisc.splice(0,1)
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
                        this.modificaciondelisc();
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
    
        this.modificarproducto=null;
        this.ident=null;
        this.unidad=null;

        this.editproducto=new producto(0,null,'','','',null,this.user.id,null,null,null,null,null);
        this.agregarpro=new producto(0,null,'','','',null,this.user.id,null,null,null,null,null);

        this.detalleimpu=new DetalleImpuestoModel(null,null,null,null);

        this.detalleimpuesotro=new DetalleImpuestoModel(null,null,null,null);
        this.detalleimpuesigv=new DetalleImpuestoModel(null,null,null,null);
        this.detalleimpuesisc=new DetalleImpuestoModel(null,null,null,null);


        this.editotro=new DetalleImpuestoModel(null,null,null,null);
        this.ocultarotrasdescripciones();
        this.ocultartablaimpuestos();
       
        this.limpiartablaimpuestos();
        this.limpiarediciondeligv();
        this.limpiarediciondelisc();
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
                        if(this.detalleimpuesisc.id_impuesto!=null){
                            this.insertarisc();
                        }
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
        this.getotro();
        this.getisc();
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