import { Component,ViewContainerRef } from "@angular/core";
import { CajasModels } from "../modelos/cajas";
import { DetalleCajasUsuariosModels } from "../modelos/detalle_cajas_usuario";
import { CajasService } from '../services/cajas.services';
import { DetalleCajasUsuarioService } from '../services/detalle.cajas.usuarios.services';
import { User } from "../../auth/interfaces/user.model";
import { AuthService } from "../../auth/services/auth.service";
import {SucursalService} from '../../sucursales/services/sucursal.service';
import {DettaleUsuarioService} from '../../usuarios/services/DetalleUsuario.service';
import {SucursalModel} from '../../sucursales/modelos/sucursal';
import {UsuarioModel} from '../../usuarios/modelos/usuarios';
import {ToastService} from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
    selector:'cajas',
    templateUrl:'../views/cajas.component.html',
    providers:[CajasService,ToastService,SucursalService]
})
export class CajasComponent{
    public cajas:CajasModels;
    public getcajas:CajasModels;
    public sucursales:SucursalModel;
    public detalle:DetalleCajasUsuariosModels;
    public detalletable:Array<DetalleCajasUsuariosModels>=[];
    public detallecajas:Array<DetalleCajasUsuariosModels>=[];
    public usuarios:UsuarioModel;
    public titulo;
    public user:User;
    public nombre;
    public mostrauser=null;
    public mostraeditcaja=null;
    public campodetexto;
    public datos;
    constructor(
        private _cajasservice:CajasService,
        private _SucursalService:SucursalService,
        private _DettaleUsuarioService:DettaleUsuarioService,
        public _DetalleCajasUsuarioService:DetalleCajasUsuarioService,
        private auth:AuthService,
        private toaste:ToastService,
        public toastr: ToastsManager,
        vcr: ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.user=this.auth.getUser();
        this.cajas = new CajasModels(0,null,null,null,this.user.id);
        this.detalle=new DetalleCajasUsuariosModels(null,null,null,null);
        this.titulo="Cajas";
        this.tablacajas();
    }
    ngOnInit(){
        this.mostrarcajas();
        this.mostarsucursales();
    }
    mostrarcajas(){
        this._cajasservice.getcajas().subscribe(
            res=>{
                console.log(res);
                this.getcajas=res;
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    obtenerusuario(id){
        this.getdetallecajasusuario(this.cajas.id);
        this.mostrauser=id;
        this.destruir();
        this.reconstruir(id);
        
        
    }

    mostrarusuario(id){
        let indice=0;
        let indice2=0;
        this._DettaleUsuarioService.seleccionardetalleusuarioporsucursal(id).subscribe(
            res=>{
                this.usuarios=res;
                if(this.mostraeditcaja!=null){
                    console.log(this.detalletable.length)
                    while(indice<res.length){
                        while(indice2<this.detalletable.length){
                            if(this.detalletable[indice2].id_usuario===this.usuarios[indice].id){
                              
                                this.detalletable[indice2].id=indice;
                                this.detalle.id=indice;
                                this.detalle.id_caja=this.cajas.id;
                                this.detalle.id_usuario=this.usuarios[indice].id;
                                this.detalle.estado=true;
                                this.detallecajas.push(this.detalle);
                                this.detalle=new DetalleCajasUsuariosModels(null,null,null,null);
                                this.usuarios[indice].id=null;
                            }
                            indice2=indice2+1;
                        }
                        indice2=0;
                        indice=indice+1;
                    }
                    console.log(this.detallecajas);
                }
                
            },
            err=>{
                console.log(<any>err)
            }
        );
    }

    getdetallecajasusuario(id){
        this._DetalleCajasUsuarioService.selectcajasusuario(id).subscribe(
            res=>{
                this.detalletable=res;
                console.log(this.detalletable);
            },
            err=>{
                console.log(<any>err)
            }
        );
    }


    mostarsucursales(){
        this._SucursalService.getsucursal().subscribe(
            res=>{
                
                this.sucursales=res;
                console.log(this.sucursales);
            },
            err=>{
                console.log(<any>err)
            }
        );
    }
    getcaja(id){
        
        this.mostraeditcaja=1;
        this.campodetexto=document.getElementById('firstName');
        this._cajasservice.selectcajas(id).subscribe(
            res=>{
               
                if(res.nombre!=null){
                    this.cajas=res;
                    this.toaste.SuccessAlert('','Echo!!');
                    
                    this.obtenerusuario(this.cajas.id_sucursal);
                    this.campodetexto.focus();
                    console.log(this.cajas);
                }else{
                    this.toaste.errorAlerta('intentelo mas tarde','Error!!');
                }
                
            },
            err=>{
                console.log(<any>err)
            }
        );
    }
    editcaja(){
        this.campodetexto=document.getElementById('firstName');
        this._cajasservice.updatecajas(this.cajas.id,this.cajas).subscribe(
            res=>{
                this.campodetexto.focus();
                if(res.code===200){
                    this.destruirtablacajas();
                    this.reconstruirtablacajas();
                    this.alertaactualizado();
                    this.actualizardetallecajusuario();
                    this.cancelaredit();
                }else{
                    this.toaste.errorAlerta('la caja ya existe','Error!');
                    this.campodetexto.select();
                }
                
            },
            err=>{
                console.log(<any>err)
            }
        );
    }
    cancelaredit(){
        this.limpiar();
        this.mostraeditcaja=null;

    }
    limpiar(){
        this.datos=document.getElementById('tabcli');
        this.datos.click();
        this.limpiarcajas();
        this.cajas=new CajasModels(0,null,null,null,this.user.id);
        this.mostrauser=null;
    }
    eliminarcaja(id){
        this._cajasservice.deletecajas(id).subscribe(
            res=>{
                console.log(res)
            },
            err=>{
                console.log(<any>err)
            }
        );
    }
    addcajas(id,index){
        let indice=0;
        let count=0;
        while(indice<this.detallecajas.length){
            if(this.detallecajas[indice].id===index){
                this.detallecajas[indice].id=index;
                this.detallecajas[indice].estado=true;
                this.usuarios[index].id=null;
                count=1;
            }
            indice=indice+1;
        }
        if(count===0){
            this.detalle.id_caja=this.cajas.id;
            this.detalle.id_usuario=id;
            this.detalle.id=index;
            this.detalle.estado=true;
            this.usuarios[index].id=null;
            this.detallecajas.push(this.detalle);
            this.detalle=new DetalleCajasUsuariosModels(null,null,null,null);
        }
        
        console.log(this.usuarios);
        console.log(this.detallecajas);
    }
    quitarcajas(index){
        let indice=0;

        while(indice<this.detallecajas.length){
            if(this.detallecajas[indice].id===index){
                this.usuarios[index].id=this.detallecajas[indice].id_usuario;
                if(this.mostraeditcaja!=null){
                    this.detallecajas[indice].estado=false;
                }else{
                    this.detallecajas.splice(indice,1);
                }
            }
            indice=indice+1;
        }
        
        console.log(this.usuarios);
        console.log(this.detallecajas);
    }
    limpiarcajas(){
        let indice=0;
        while(indice<this.detallecajas.length){
            this.detallecajas.splice(0,1)
        }
    }
    guardardetallecajausuarios(){
        let ind=0;
        while(ind<this.detallecajas.length){
            this._DetalleCajasUsuarioService.adddetallecajasusuario(this.detallecajas[ind]).subscribe(
                res=>{
                    console.log(res)
                },
                err=>{
                    console.log(<any>err)
                }
            );
            ind=ind+1
        }
        
    }
    actualizardetallecajusuario(){
        let i=0;
        while(i<this.detallecajas.length){
            this._DetalleCajasUsuarioService.updatecajasusuario(this.detallecajas[i]).subscribe(
                res=>{
                    console.log(res)
                },
                err=>{
                    console.log(<any>err)
                }
            );
            i=i+1;
        }
    }
    guardarCaja(){
        this.campodetexto=document.getElementById('firstName');
        console.log(this.cajas);
        this._cajasservice.addcajas(this.cajas).subscribe(
            res=>{
                console.log(res)
                this.campodetexto.focus();
                if(res.code===200){
                    this.guardardetallecajausuarios();
                    this.destruirtablacajas();
                    this.reconstruirtablacajas();
                    this.alertaecho();
                    this.limpiar();
                }else{
                    this.toaste.errorAlerta('la caja ya existe','Error!');
                    this.campodetexto.select();
                }

            },
            err=>{
                console.log(<any>err)
            }
        );
    }
    alertaerror(){
        swal({
            position: 'center',
            icon: "warning",
            title: 'ocurio un error ',
            text:'intentelo de nuevo mas tarde',
            buttons: true,
            timer: 1500,
          })
    }
    alertaecho(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Insertado',
            text:'La Caja se agrego correctamente',
            buttons: false,
            timer: 3000
          })
    }
    alertaactualizado(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Insertado',
            text:'La Caja se Actualizo correctamente',
            buttons: false,
            timer: 3000
          })
    }
    tabla(){
        setTimeout(function(){
            $(document).ready(function() {
                 $('#mytable').DataTable();
            });
        },2000);
    }
    tablacajas(){
        //this.mostrar();
       
        setTimeout(function(){
            $(function(){
                 $('#tablacajas').DataTable({
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ]
                 });
            });
        },3000);
    }
    destruirtablacajas(){	
        var table = $('#tablacajas').DataTable(); table .clear() ;
        $('#tablacajas').DataTable().destroy();
    }
    reconstruirtablacajas(){
        this.mostrarcajas();
        this.tablacajas();
    }
    destruir(){	
        var table = $('#mytable').DataTable(); table .clear() ;
        $('#mytable').DataTable().destroy();
    }
    reconstruir(id){
        this.mostrarusuario(id);
        this.tabla();
    }
}