import { Component,ViewContainerRef } from "@angular/core" ;
import { UsuarioService } from "../../usuarios/services/usuarios.service";
import { UsuarioModel } from '../../usuarios/modelos/usuarios';
import {DocumentoModel} from '../../TipoDocumento/models/documento';
import {DocumentoService}from '../../TipoDocumento/services/documento.service';
import {SucursalModel} from '../../sucursales/modelos/sucursal';
import {SucursalService}from '../../sucursales/services/sucursal.service';
import { DettaleUsuarioService } from "../../usuarios/services/DetalleUsuario.service";
import { DetalleUsuarioModel } from '../../usuarios/modelos/DetalleUsuario';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/interfaces/user.model';
import {OrdenPedidosService} from '../../orden-de-pedido/services/Ordendepedido.service';
import {Router,ActivatedRoute,Params}from '@angular/router';
import { environment } from "../../../environments/environment";


import {ToastService} from '../../toastalert/service/toasts.service'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { PermisosRolesModel } from "../modelos/permisos_roles";

declare var jQuery:any;
declare var $:any; 
declare var swal:any;

@Component({
    selector:'add-usuario',
    templateUrl:'../views/usuarios.component.html',
    providers:[UsuarioService,DocumentoService,SucursalService,DettaleUsuarioService,ToastService,OrdenPedidosService]
})
export class usuarioscomponent{
    [x: string]: any;
    public paswor;
    public confirmar;
    public usuario:UsuarioModel;
    public documentos:DocumentoModel;
    public sucursales:Array<SucursalModel>=[];
    public DetalleUsuario:Array<DetalleUsuarioModel>=[];
    public detalleusu:DetalleUsuarioModel;
    public titulo;
    public compara;
    public cuenta;
    public ap;
    public id;
    public siguiente;
    public siguientepermisosurl;
    public user:User;
    public nombre;
    public fecha;
    public iguales;
    public filesToUpload:File[];
    public text;
    public image:any;
    public url;
    public ruta;
    public filear;
    public res:any;
    imageUrl: string = "assets/images/1.png";
    fileToUpload:File = null;
    public encabezados:Array<any>=[];
    public url2;
    public verpag=true;
    public mandar:PermisosRolesModel;
    constructor(
        private _UsuarioService:UsuarioService,
        private _DocumentoService:DocumentoService,
        private _SucursalService:SucursalService,
        private _OrdenPedidosService:OrdenPedidosService,
        private _DettaleUsuarioService:DettaleUsuarioService,
        private auth:AuthService,
        private _router:Router,
        private toaste:ToastService,
        public toastr: ToastsManager,
        vcr: ViewContainerRef
    ){
        this.url2=environment.url+'admin/usuarios';
        this.user=this.auth.getUser();
        this.mandar = new PermisosRolesModel(this.user.id,null,this.url2,null,null);
        let i=0;
        this._UsuarioService.getpermisos(this.mandar).subscribe(
            res=>{
                console.log(res)
                if(res.mensaje==true){
                    this.verpag=true;
                }else{
                    if(res.mensaje!=false){
                        this.verpag=true;
                    }else{
                        console.log('esta saliendo')
                        this._router.navigate(['/'+this.user.rol]);
                    }
                }
                
            },
            err=>{
                console.log(<any>err);
            }
        )
        this.toastr.setRootViewContainerRef(vcr);
        this.user=this.auth.getUser();
        this.usuario = new UsuarioModel(null,'','',null,null,'',null,'','1994-01-01','','','','',null);
        this.detalleusu=new DetalleUsuarioModel(null,0,0,null);
        //this.documentos=new DocumentoModel(null,null,null);
        this.titulo="Datos Personales"
        this.paswor=null;
        this.confirmar=null;
        this.compara=0;
        this.cuenta=0;
        this.ap=0;
        this.siguiente=0;
        this.siguientepermisosurl=0;
        this.id=0;
        this.fecha=null;
        this.iguales=false;
        this.url=environment.url+'admin/';   
        this.filesToUpload=null;  
        this.image=this.url+'/imagenes/2.png';
        this.encabezados.push({nombre:"Inicio",abrir:false,estado:false,componentes:[]})
        this.encabezados[0].componentes.push({nombre:"Reportes de Inicio",estado:false,url:this.url,tipo_permiso:'reporte'});
        this.encabezados.push({nombre:"Proveedor",abrir:false,estado:false,componentes:[]})
        this.encabezados[1].componentes.push({nombre:"Agregar proveedor",estado:false,url:this.url+"Proveedor",tipo_permiso:'insercion'});
        this.encabezados[1].componentes.push({nombre:"Modificar proveedor",estado:false,url:this.url+"Proveedor",tipo_permiso:'edicion'});
        this.encabezados[1].componentes.push({nombre:"Eliminar proveedor",estado:false,url:this.url+"Proveedor",tipo_permiso:'anulacion'});
        this.encabezados.push({nombre:"Compras",abrir:false,estado:false,componentes:[]})
        this.encabezados[2].componentes.push({nombre:"Agregar compra",estado:false,url:this.url+"transaccion",tipo_permiso:'insercion'});
        this.encabezados[2].componentes.push({nombre:"Lista de compras",estado:false,url:this.url+"transaccion/list",tipo_permiso:'reporte'});
        this.encabezados[2].componentes.push({nombre:"Anular compra",estado:false,url:this.url+"transaccion/anular",tipo_permiso:'anulacion'});
        this.encabezados.push({nombre:"Servicios",abrir:false,estado:false,componentes:[]})
        this.encabezados[3].componentes.push({nombre:"Agregar servicio",estado:false,url:this.url+"servicio",tipo_permiso:'insercion'});
        this.encabezados[3].componentes.push({nombre:"Anular servicio",estado:false,url:this.url+"servicio/anular",tipo_permiso:'anulacion'});
        this.encabezados[3].componentes.push({nombre:"Lista de Servicios",estado:false,url:this.url+"servicio/list",tipo_permiso:'reporte'});
        this.encabezados.push({nombre:"Cliente",abrir:false,estado:false,componentes:[]})
        this.encabezados[4].componentes.push({nombre:"Agregar cliente",estado:false,url:this.url+"cliente",tipo_permiso:'insercion'});
        this.encabezados[4].componentes.push({nombre:"Modificar cliente",estado:false,url:this.url+"cliente/edit/:id",tipo_permiso:'edicion'});
        this.encabezados[4].componentes.push({nombre:"Eliminar cliente",estado:false,url:this.url+"cliente",tipo_permiso:'anulacion'});
        this.encabezados.push({nombre:"Empresa",abrir:false,estado:false,componentes:[]})
        this.encabezados[5].componentes.push({nombre:"Modificar Empresa",estado:false,url:this.url+"empresa/edit",tipo_permiso:'pagina'});
        this.encabezados.push({nombre:"Productos",abrir:false,estado:false,componentes:[]})
        this.encabezados[6].componentes.push({nombre:"Agregar productos",estado:false,url:this.url+"productos",tipo_permiso:'insercion'});
        this.encabezados[6].componentes.push({nombre:"Modificar productos",estado:false,url:this.url+"productos",tipo_permiso:'edicion'});
        this.encabezados[6].componentes.push({nombre:"Eliminar productos",estado:false,url:this.url+"productos",tipo_permiso:'anulacion'});
        this.encabezados.push({nombre:"Almacenes",abrir:false,estado:false,componentes:[]})
        this.encabezados[7].componentes.push({nombre:"Agregar almacen",estado:false,url:this.url+"almacenes",tipo_permiso:'insercion'});
        this.encabezados[7].componentes.push({nombre:"Modificar almacen",estado:false,url:this.url+"almacenes",tipo_permiso:'edicion'});
        this.encabezados[7].componentes.push({nombre:"Eliminar almacen",estado:false,url:this.url+"almacenes",tipo_permiso:'anulacion'});
        this.encabezados.push({nombre:"Precios de productos",abrir:false,estado:false,componentes:[]})
        this.encabezados[8].componentes.push({nombre:"modificar precios",estado:false,url:this.url+"almacen",tipo_permiso:'edicion'}); 
        //this.encabezados[8].componentes.push({nombre:"ver codigo productos",estado:false,url:this.url+"almacen",tipo_permiso:'reporte'});
        this.encabezados.push({nombre:"Orden de pedido",abrir:false,estado:false,componentes:[]})
        this.encabezados[9].componentes.push({nombre:"Agregar orden de pedido",estado:false,url:this.url+"pedido",tipo_permiso:'pagina'});
        this.encabezados[9].componentes.push({nombre:"lista de pedidos",estado:false,url:this.url+"pedido/listar",tipo_permiso:'pagina'});
        this.encabezados.push({nombre:"Inventario",abrir:false,estado:false,componentes:[]})
        this.encabezados[10].componentes.push({nombre:"Modificar inventario",estado:false,url:this.url+"inventario",tipo_permiso:'edicion'});
        this.encabezados[10].componentes.push({nombre:"reportes de inventario",estado:false,url:this.url+"reporteInventario",tipo_permiso:'insercion'});
        this.encabezados.push({nombre:"Usuarios",abrir:false,estado:false,componentes:[]})
        this.encabezados[11].componentes.push({nombre:"Agregar usuario",estado:false,url:this.url+"usuarios",tipo_permiso:'insercion'});
        this.encabezados[11].componentes.push({nombre:"Modificar usuario(datos generales)",estado:false,url:this.url+"editarusuario",tipo_permiso:'edicion'});
        this.encabezados[11].componentes.push({nombre:"Eliminar usuario",estado:false,url:this.url+"editarusuario",tipo_permiso:'anulacion'});
        this.encabezados.push({nombre:"Cajas",abrir:false,estado:false,componentes:[]})
        this.encabezados[12].componentes.push({nombre:"Agregar caja",estado:false,url:this.url+"cajas",tipo_permiso:'insercion'});
        this.encabezados[12].componentes.push({nombre:"Modificar caja",estado:false,url:this.url+"cajas",tipo_permiso:'edicion'});
        this.encabezados[12].componentes.push({nombre:"Eliminar caja",estado:false,url:this.url+"cajas",tipo_permiso:'anulacion'});
        this.encabezados.push({nombre:"Ventas",abrir:false,estado:false,componentes:[]})
        this.encabezados[13].componentes.push({nombre:"Ventas Gratuitas",estado:false,url:this.url+"ventas",tipo_permiso:'venta_gratis'});
        this.encabezados[13].componentes.push({nombre:"Agregar descuento",estado:false,url:this.url+"ventas",tipo_permiso:'descuento_producto'});
        this.encabezados[13].componentes.push({nombre:"Agregar Descuento global",estado:false,url:this.url+"ventas",tipo_permiso:'descuento_global'});
        
        console.log(this.encabezados);
        //this._router.navigate(['/'+this.user.rol+'/editarusuario']);
    }
    ngOnInit(){
        this.mostradocuemnto();
        this.mostrarsucursal();
        this.fechaactual();
        
    }
    abrirencabezado(indice){
        let i=0;
        while(i<this.encabezados.length){
            if(indice==i){
                this.encabezados[i].abrir=true;
            }else{
                this.encabezados[i].abrir=false;
            }
            i++
        }
    }
    marcarencabezado(indice){
        let i=0;
        this.encabezados[indice].estado=true;
        while(i<this.encabezados[indice].componentes.length){
            this.encabezados[indice].componentes[i].estado=true;
            this.siguientepermisosurl++;
            i++;
        }
    }
    desmarcarencabezado(indice){
        
        let i=0;
        this.encabezados[indice].estado=false;
        while(i<this.encabezados[indice].componentes.length){
            this.encabezados[indice].componentes[i].estado=false;
            this.siguientepermisosurl=this.siguientepermisosurl-1;
            i++;
        }
    }
    marcaropcion(indiceenca,indiceop){
        this.siguientepermisosurl++;
        let i=0;
        let marca=true;
        console.log(indiceenca,indiceop)
        this.encabezados[indiceenca].componentes[indiceop].estado=true;
        while(i<this.encabezados[indiceenca].componentes.length){
            if(this.encabezados[indiceenca].componentes[i].estado==false){
                marca=false;
            }
            i++;
        }
        if(marca==true){
            this.marcarencabezado(indiceenca);
        }
    }
    desmarcaropcion(indiceenca,indiceop){
        this.siguientepermisosurl=this.siguientepermisosurl-1;
        let i=0;
        let cancel=true;
        console.log(indiceenca,indiceop)
        this.encabezados[indiceenca].componentes[indiceop].estado=false;
        while(i<this.encabezados[indiceenca].componentes.length){
            if(this.encabezados[indiceenca].componentes[i].estado==true){
                cancel=false;
            }
            i++;
        }
        if(cancel==true){
            this.desmarcarencabezado(indiceenca);
        }
    }
    cerrarencabezado(indice){
        this.encabezados[indice].abrir=false;
    }
    mostarriname(file: FileList,fileInput: any){
        this.filear=document.getElementById('image');
        var filePath = this.filear.value;
        console.log(file[0].size);
        var allowedExtensions = /(.jpg|.jpeg|.png)$/i;
       
        if(!this.filear.value){
            console.log('nada');
            this.filesToUpload=null;
        }else{
            if(file[0].size> 2000000){
                console.log('muy granmde');
                this.filesToUpload=null;
                this.filear.value="";
            }else{
                if(!allowedExtensions.exec(filePath)){
                    console.log('no entro')
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
    isertarimagen(){
       let dni=this.usuario.numero_documento;  
        
        if(this.filesToUpload==null){
            this.usuario.imagen='2.png';
            this.guardarusuario();
        }else{
            this._UsuarioService.insertariamgen(this.filesToUpload,dni).subscribe(
                respuesta=>{
                    
                    this.res=respuesta;
                    console.log(this.res);
                    if(this.res.code==200){
                        this.usuario.imagen=this.res.name+this.usuario.numero_documento+'.'+this.res.extencion;
                        this.guardarusuario();

                    }
                },
                error=>{
                    console.log(<any>error);
                }
            );  
        }
           
    }
    getimage(name){
        this.image=this.url+'/imagenes/'+name;
        console.log('get'+name);
    }
    
    fechaactual(){
        this._OrdenPedidosService.getfecha().subscribe(
            respuesta=>{
                this.fecha=respuesta.res;
                console.log(this.fecha);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    alimentarareglodp(){
        this.titulo="Asiganacion de Permisos";
        this.ap=1;
        console.log(this.usuario);
        console.log(this.ap+' '+this.cuenta);
        this.destruirtablasuc();
        this.reconsttablasuc();
        
    }
    alimentararegloap(){
        
        this.titulo="Seguridad de la Cuenta";
        this.ap=0;
        this.cuenta=1;
        console.log(this.usuario);
        console.log(this.ap+' '+this.cuenta)
    }
    addsucursal(index,id){
        this.siguiente=this.siguiente+1;
        this.sucursales[index].id=null;
        this.detalleusu.id=index;
        this.detalleusu.id_sucursal=id;
        this.detalleusu.permiso=true;
        this.DetalleUsuario.push(this.detalleusu);
        this.detalleusu=new DetalleUsuarioModel(null,0,0,null);
        console.log(this.DetalleUsuario);
        console.log(this.ap+' '+this.cuenta)
    }
    quitarsucursal(index){
        this.siguiente=this.siguiente-1;
        while(this.id<this.DetalleUsuario.length){
            if(this.DetalleUsuario[this.id].id===index)
            {
                this.sucursales[index].id=this.DetalleUsuario[this.id].id_sucursal;
                this.DetalleUsuario.splice(this.id,1);
            }
            this.id=this.id+1;
        }
        this.id=0;
        console.log(this.DetalleUsuario);
    }
    guardarusuario(){
        this.nombre =document.getElementById('emailunico');
        this.id=0;
        this.paswor =document.getElementById('pasword');
        this.confirmar =document.getElementById('confirmar');
        if(this.paswor.value===this.confirmar.value){
            console.log(this.usuario);
            this._UsuarioService.addusuario(this.usuario).subscribe(
            response=>{
                console.log(response);
                this.nombre.focus();
                //this.usuario = new UsuarioModel(null,'','',0,0,'',0,'','','','','','',null);
                if(response.code===300){
                    let text="Ese Email ya se encuentra registrado";
                    this.toaste.errorAlerta(text,'Error!');
                    this.usuario.password=null;
                    this.usuario.confirme=null;

                    this.nombre.select();
                    console.log(this.usuario);
                }else{
                    if(response.code===200){
                       this.guardardetalle();
                       
                    }
                }

            },
            error=>{
                console.log(<any>error);
            }
            );
            this.titulo="Datos Personales";
        }else{
            this.contraseñadifrerente();
        }
        
        
    }
    guardardetalle(){
        this.id=0;
        let error=0;
        while(this.id<this.DetalleUsuario.length){
            console.log(this.id);
            this._DettaleUsuarioService.adddetalleusuario(this.DetalleUsuario[this.id]).subscribe(
                respuesta=>{
                    console.log(respuesta);
                    this.limpiar();
                    this.guardaralerta();
                    console.log(this.DetalleUsuario);
                },
                error=>{
                    error++;
                    console.log(<any>error);
                }
            )
            this.id=this.id+1;
        }
        if(error==0){
            this.gurardarpermisos();
            //this._router.navigate(['/'+this.user.rol+'/editarusuario']);
        }
        this.id=0;
    }
    gurardarpermisos(){
        console.log('entro')
        /*this.encabezados.push({nombre:null,abrir:null,estado:null,componentes:[]})
        this.encabezados[14].componentes.push({nombre:null,estado:false,url:this.url,tipo_permiso:null});
        this.encabezados[14].componentes.push({nombre:null,estado:false,url:this.url+"ventas",tipo_permiso:null});
        this.encabezados[14].componentes.push({nombre:null,estado:false,url:this.url+"ventas",tipo_permiso:null});*/
        let i=0,j=0;
        while(i<this.encabezados.length){
            while(j<this.encabezados[i].componentes.length){
                if(this.encabezados[i].componentes[j].estado==true){

                    this._DettaleUsuarioService.addpermisosusuarios(this.encabezados[i].componentes[j]).subscribe(
                        res=>{
                            console.log(res)
                        },
                        err=>{
                            console.log(<any>err);
                        }
                    )
                }
                j++;
            }
            j=0;
            i++;
        }
    }
    mostradocuemnto(){
        this._DocumentoService.getDocumPersona().subscribe(
            response=>{
                console.log(response);
                this.documentos=response;
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    mostrarsucursal(){
        this._SucursalService.getsucursal().subscribe(
            response=>{
                console.log(response);
                this.sucursales=response;
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    volverapermisos(){
        this.ap=1;
        this.cuenta=0;
    }
    limpiar(){
        this.cuenta=0;
        this.usuario = new UsuarioModel(null,'','',null,null,'',null,'','1994-01-01','','','','',null);
        this.detalleusu=new DetalleUsuarioModel(null,0,0,null);
        let numero=this.DetalleUsuario.length;
        let indice=0;
        while(this.id<numero){
            while(indice<this.sucursales.length){
                if(this.DetalleUsuario[this.id].id===indice){
                    this.sucursales[indice].id=this.DetalleUsuario[this.id].id_sucursal;
                }
            indice=indice+1;
            }
            this.id=this.id+1;
        }
        this.id=0;
        while(this.id<numero){
            this.DetalleUsuario.splice(0,1);
            this.id=this.id+1;
        }
        this.id=0;
     }
    atras(){
        this.cuenta=0;
        this.ap=0;
        console.log("es atras");
    }
    limitar(){
        this.paswor =document.getElementById('pasword');
        this.confirmar =document.getElementById('confirmar');
       //console.log(this.input.value);
        if(this.paswor.value===this.confirmar.value){
            this.iguales=true;
            console.log('iguales'+this.compara);
            this.confirmar.style="border: 0.3px solid #3bc1ff;";
           this.compara=1;
        }else{
            this.iguales=false;
            this.compara=0
            
            this.confirmar.style="border: 0.3px solid red;";
            console.log('diferentes'+this.compara);
        }
   }
    tablasucursales(){
        setTimeout(function(){
            $(function(){
                 $('#tablasucursales').DataTable();
            });
        },500);
    }
    destruirtablasuc(){
        var table = $('#tablasucursales').DataTable(); table .clear() ;
        $('#tablasucursales').DataTable().destroy();
    }
    reconsttablasuc(){
        this.tablasucursales();
    }
    guardaralerta(){
        swal({
            position: 'center',
            icon: "success",
            title: 'se guardo el usuario',
            buttons: false,
            timer: 1000
          })
    }
    contraseñadifrerente(){
        swal({
            position: 'center',
            icon: "warning",
            title: 'la contraseña es incorecta',
            buttons: false,
            timer: 1000
          })
    }
    emailregistrado(){
        swal({
            position: 'center',
            icon: "warning",
            title: 'el email ya existe',
            buttons: false,
            timer: 2000
          })
    }
}