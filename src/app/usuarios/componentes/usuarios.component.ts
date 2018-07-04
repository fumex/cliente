import { Component,ViewContainerRef } from "@angular/core";
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


import {ToastService} from '../../toastalert/service/toasts.service'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { environment } from "../../../environments/environment";

declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
    selector:'add-usuario',
    templateUrl:'../views/usuarios.component.html',
    providers:[UsuarioService,DocumentoService,SucursalService,DettaleUsuarioService,ToastService,OrdenPedidosService]
})
export class usuarioscomponent{
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
        this.id=0;
        this.fecha=null;
        this.iguales=false;
        this.url=environment.api_url; 
        this.filesToUpload=null;  
        this.image=this.url+'/imagenes/2.png';
    }
    ngOnInit(){
        this.mostradocuemnto();
        this.mostrarsucursal();
        this.fechaactual();
        
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
    isertarimagen(dni){
        dni=this.usuario.numero_documento;  
        
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
                this.usuario = new UsuarioModel(null,'','',0,0,'',0,'','','','','','',null);
                if(response.code===200){
                    console.log("entro al if");
                   this.guardardetalle();
                   this._router.navigate(['/'+this.user.rol+'/editarusuario']);
                }
            },
            error=>{
                console.log(<any>error);
                if(error.status==500){
                    let text="Ese Email ya se encuentra registrado";
                    this.toaste.errorAlerta(text,'Error!');
                    this.usuario.password=null;
                    this.usuario.confirme=null;
                    this.nombre.focus();
                    this.nombre.select();
                }
            }
            );
            this.titulo="Datos Personales";
        }else{
            this.contraseñadifrerente();
        }
        
        
    }
    guardardetalle(){
        this.id=0;
       
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
                    console.log(<any>error);
                }
            )
            this.id=this.id+1;
        }
        this.id=0;
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