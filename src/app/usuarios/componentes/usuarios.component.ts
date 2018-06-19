import { Component } from "@angular/core";
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

declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
    selector:'add-usuario',
    templateUrl:'../views/usuarios.component.html',
    providers:[UsuarioService,DocumentoService,SucursalService,DettaleUsuarioService]
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
    constructor(
        private _UsuarioService:UsuarioService,
        private _DocumentoService:DocumentoService,
        private _SucursalService:SucursalService,
        private _DettaleUsuarioService:DettaleUsuarioService,
        private auth:AuthService,
    ){
        this.user=this.auth.getUser();
        this.usuario = new UsuarioModel(null,'','',null,null,'',null,'','1994-01-01','','','','');
        this.detalleusu=new DetalleUsuarioModel(null,0,0,0);
        //this.documentos=new DocumentoModel(null,null,null);
        this.titulo="Datos Personales"
        this.paswor=null;
        this.confirmar=null;
        this.compara=0;
        this.cuenta=0;
        this.ap=0;
        this.siguiente=0;
        this.id=0;
    }
    ngOnInit(){
        this.mostradocuemnto();
        this.mostrarsucursal();
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
        this.detalleusu.permiso=1;
        this.DetalleUsuario.push(this.detalleusu);
        this.detalleusu=new DetalleUsuarioModel(null,0,0,0);
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
    guardarusuario(pas1,pas2){
        //this.categoria = new categoria(tipo1);
        this.id=0;
        this.paswor =document.getElementById('pasword');
        this.confirmar =document.getElementById('confirmar');
        if(this.paswor.value===this.confirmar.value){
            console.log(this.usuario);
            this._UsuarioService.addusuario(this.usuario).subscribe(
            response=>{
                console.log(response);
                this.usuario = new UsuarioModel(null,'','',0,0,'',0,'','','','','','');
                if(response.code===200){
                    console.log("entro al if");
                   this.guardardetalle();
                }else{
                    if(response.code===408){
                        this.emailregistrado();
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
        this.usuario = new UsuarioModel(null,'','',null,null,'',null,'','1994-01-01','','','','');
        this.detalleusu=new DetalleUsuarioModel(null,0,0,0);
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
            console.log('iguales'+this.compara);
            this.confirmar.style="border: 0.3px solid #3bc1ff;";
           this.compara=1;
        }else{
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