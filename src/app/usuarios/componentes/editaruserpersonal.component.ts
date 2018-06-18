import { Component } from "@angular/core";
import { UsuarioService } from "../../usuarios/services/usuarios.service";
import { UsuarioModel } from '../../usuarios/modelos/usuarios';
import {SucursalModel} from '../../sucursales/modelos/sucursal';
import {SucursalService}from '../../sucursales/services/sucursal.service';
import { DettaleUsuarioService } from "../../usuarios/services/DetalleUsuario.service";
import { DetalleUsuarioModel } from '../../usuarios/modelos/DetalleUsuario';
import { AuthService } from '../../auth/services/auth.service';
import {DocumentoModel} from '../../TipoDocumento/models/documento';
import {DocumentoService}from '../../TipoDocumento/services/documento.service';
import { User } from '../../auth/interfaces/user.model';

declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
    selector:'add-usuario',
    templateUrl:'../views/usuarios.component.html',
    providers:[UsuarioService,,SucursalService,DettaleUsuarioService,AuthService]
})
export class EditarUsuarioPersonal{
    public usuario:UsuarioModel;
    public sucursales:Array<SucursalModel>=[];
    public DetalleUsuario:Array<DetalleUsuarioModel>=[];
    public detalleusu:DetalleUsuarioModel;
    public documentos:DocumentoModel;
    public titulo;
    public compara;
    public cuenta;
    public idusuario;
    public ap;
    public id;
    public id2;
    public count;
    public siguiente;
    public usuarios:UsuarioModel;
    constructor(
        private _UsuarioService:UsuarioService,
        private _SucursalService:SucursalService,
        private _DettaleUsuarioService:DettaleUsuarioService,
        private _DocumentoService:DocumentoService,
    ){
        this.usuario = new UsuarioModel(null,'','',null,null,'',null,'','1994-01-01','','','','');
        this.detalleusu=new DetalleUsuarioModel(null,0,0,0);

        //this.documentos=new DocumentoModel(null,null,null);
        this.titulo="Mantenimiento de Usuarios"
        this.compara=0;
        this.cuenta=1;
        this.ap=1;
        this.siguiente=0;
        this.id=0;
        this.id2=0;
        this.count=0;
        this.idusuario=0
        
    }
    ngOnInit(){
        this.mostrarsucursal();
        this.mostradocuemnto();
        this.mostrarusuarios();
                                                           
    }
    confirmaractualizar(id){
        this.idusuario=id;
        console.log(id);
        this.cuenta=0;
        this.ap=0;
        this.mostraruduario(id);
        this.mostrardetalleusuario(id); 
    }
    borraralerta(id){
        this._UsuarioService.deshabilitarusuario(id).subscribe(
            response=>{
                console.log(response);
                this.mostrarusuarios();
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    atras(){
        this.cuenta=0;
        this.ap=0;
    }
    volvertablausuarios(){
        this.usuario= new UsuarioModel(null,'','',null,null,'',null,'','1994-01-01','','','','');
        this.cuenta=1;
        this.ap=1;
    }
    alimentarareglodp(){
        this.ap=1;
        console.log(this.usuario);
        console.log(this.ap+' '+this.cuenta)
        
    }
    mostraruduario(id){
        this._UsuarioService.getusuario(id).subscribe(
            response=>{
                this.tabla2();          
                this.usuario=response;
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    mostrarusuarios(){
        this._UsuarioService.usuarios().subscribe(
            response=>{
                this.usuarios=response;
                console.log(this.usuarios);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    mostrardetalleusuario(id){
        this._DettaleUsuarioService.seleccionardetalleusuario(id).subscribe(
            respuesta=>{
                this.detalleusu=respuesta;
                while(this.id<respuesta.length){
                    
                    
                    if(respuesta[this.id].permiso!=2){
                        
                        
                        while(this.id2 < this.sucursales.length){
                            

                            if(this.detalleusu[this.id].id_sucursal==this.sucursales[this.id2].id){
                                this.sucursales[this.id2].id=null;
                                
                            }
                            this.id2=this.id2+1;
                        }
                        this.siguiente=this.siguiente+1;
                        this.detalleusu[this.id].id=this.id;
                        this.DetalleUsuario.push(this.detalleusu[this.id]);                        
                        this.id2=0;
                    }                   
                    this.id=this.id+1;
                }
                console.log(this.DetalleUsuario);
            },
            error=>{
                console.log(<any>error);
            }
        );
        this.id=0;
        
    }
    mostradocuemnto(){
        this._DocumentoService.getDocumentos().subscribe(
            response=>{
                
                this.documentos=response;
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    addsucursal(index,id){
        this.detalleusu=new DetalleUsuarioModel(null,0,this.idusuario,0);
        this.siguiente=this.siguiente+1;
        this.id=0;
        this.sucursales[index].id=null;
        while(this.id<this.DetalleUsuario.length){
            if(this.DetalleUsuario[this.id].id===index){
                this.DetalleUsuario[this.id].permiso=1;
                this.count=this.count+1;
            }
            this.id=this.id+1;
        }
        if(this.count===0){
            this.detalleusu.id=index;
            this.detalleusu.id_sucursal=id;
            this.detalleusu.permiso=1;
            this.DetalleUsuario.push(this.detalleusu);
            this.detalleusu=new DetalleUsuarioModel(null,0,this.idusuario,0);
            console.log(this.DetalleUsuario);
            console.log("entro")
        }
        this.count=0;
        this.id=0;
        console.log(this.DetalleUsuario);
    }

    quitarsucursal(index){
        this.id=0;
        this.siguiente=this.siguiente-1;
        while(this.id<this.DetalleUsuario.length){
            if(this.DetalleUsuario[this.id].id===index)
            {
                this.sucursales[index].id=this.DetalleUsuario[this.id].id_sucursal;
                this.DetalleUsuario[this.id].permiso=2;
                //this.DetalleUsuario.splice(this.id,1);
            }
            this.id=this.id+1;
        }
        this.id=0;
        console.log(this.DetalleUsuario);
    }
   
    mostrarsucursal(){
        this._SucursalService.getsucursal().subscribe(
            response=>{

                this.sucursales=response;

            },
            error=>{
                console.log(<any>error);
            }
        );

    }
    limpiar(){
        this.cuenta=0;
        this.usuario = new UsuarioModel(null,'','',null,null,'',null,'','','','','','');
        this.detalleusu=new DetalleUsuarioModel(null,0,this.idusuario,0);
        while(this.id<this.DetalleUsuario.length){
            this.DetalleUsuario.splice(this.id,1);
            this.id=this.id+1;
        }
        this.id=0;
     }
     guardarcambios(){
         this.id=0;
         this._UsuarioService.updateusuario(this.idusuario,this.usuario).subscribe(
            response=>{

                console.log(response);

            },
            error=>{
                console.log(<any>error);
            }
         );
         while(this.id<this.DetalleUsuario.length){
             this._DettaleUsuarioService.updatedetalleusuario(this.DetalleUsuario[this.id]).subscribe(
                response=>{
                    console.log(response);
    
                },
                error=>{
                    console.log(<any>error);
                }
            );
            this.id=this.id+1;
         }
         this.id=0;
     }
     tabla2(){
        setTimeout(function(){
            $(function(){
                 $('#mytable').DataTable();
            });
        },500);
    }
}