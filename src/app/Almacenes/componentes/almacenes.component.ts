import { Component ,ViewContainerRef} from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import{AlmacenesService}from '../services/almacenes.service'
import{almacen} from '../modelos/almacenes';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/interfaces/user.model';

import {ToastService} from '../../toastalert/service/toasts.service'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { PermisosRolesModel } from '../../usuarios/modelos/permisos_roles';
import { environment } from '../../../environments/environment';
import { UsuarioService } from '../../usuarios/services/usuarios.service';

declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
  selector: 'almacenes',
  templateUrl: '../views/almacenes.component.html',
  providers: [AlmacenesService,ToastService]
})
export class AlmacenesComponent{
    public titulo:string;
    public ident;
    public idalmacen;
    public boraralmacen;
    public almacenes:almacen[];
    public editalmacen:almacen;
    public almacen:almacen;
    public user:User
    public nombre;
    public url2;
    public veradd=null;
    public veredit=null;
    public verdelete=null;
    public mandar:PermisosRolesModel;
	constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _almacenesService:AlmacenesService,
        private auth:AuthService,
        private toaste:ToastService,
        public toastr: ToastsManager,
        vcr: ViewContainerRef,
        private _UsuarioService:UsuarioService,
        
    ){
        this.url2=environment.url+'admin/almacenes';
        this.user=this.auth.getUser();
        this.mandar = new PermisosRolesModel(this.user.id,null,this.url2,null,null);
        let i=0;
        this._UsuarioService.getpermisos(this.mandar).subscribe(
            res=>{
                console.log(res)
                if(res.mensaje==true){
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
        this.titulo = "Almacenes";
        this.tabla();
        this.user=this.auth.getUser();
        this.almacen=new almacen(0,'','','',null,this.user.id);
        this.editalmacen=new almacen(0,'','','',null,this.user.id);
        this.ident=null;
        this.idalmacen=null;
        this.boraralmacen=null;
        this.confirmaractualizar(this.idalmacen);
    }
    ngOnInit(){
        this.mostrar();
        this.actualizar(this.ident);
    }  
    actualizar(id){
        this.ident=id;
        console.log(this.ident);
    }
    editarAlmacen(){
        //this.productos=new producto(0,'','','','',null);
        this.nombre=document.getElementById('editalmacenaje');
        console.log(this.editalmacen.id);
        console.log(this.editalmacen);
        this._almacenesService.actualizaralmacen(this.idalmacen,this.editalmacen).subscribe(
            result=>{
                this.nombre.focus();
                console.log(result);
                console.log(this.editalmacen);
                if(result.code===300){
                    let text="el almacen ya existe";
                    this.toaste.errorAlerta(text,'Error!');
                    
                    this.nombre.select();
                }else{
                    if(result.code===200){
                        this.mostrar();
                        this.limpiar();
                        this.destruir();
                        this.reconstruir();
                        this.modificaralerta();
                    }
                }
                
            },
            error=>{
                console.log(<any>error);             
            }
        );
    }
    confirmaractualizar(id){
        this.idalmacen=id;
        console.log(this.idalmacen );
        if(this.idalmacen!=null)
        {
            this._almacenesService.SeleccionarAlmacen(this.idalmacen).subscribe(
                result=>{
                    this.editalmacen=result;
                },
                error=>{
                    console.log(<any>error);
                }   
            );
            
        }else{
            console.log(this.idalmacen);
            
        }
      
    }
    cancelar(){
        this.limpiar();
    }
    mostrar(){
        this.limpiar();
        this._almacenesService.getAlmacenes().subscribe(
            result=>{
                this.almacenes=result;
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }   
        );

    }
    limpiar(){
        this.ident=null;
        this.idalmacen=null;
        this.editalmacen=new almacen(0,'','','',null,this.user.id);
        this.almacen=new almacen(0,'','','',null,this.user.id);
    }
    agregaralmacen(){
        this.nombre=document.getElementById('firstName');
        this._almacenesService.addAlmacenes(this.almacen).subscribe(
            result=>{
                this.nombre.focus();
                console.log(result);
                if(result.code===300){
                    let text="el almacen ya existe";
                    this.toaste.errorAlerta(text,'Error!');
                    this.nombre.select();
                    
                }else{
                    if(result.code===200){
                        this.limpiar();
                        this.destruir();
                        this.reconstruir();
                        this.modificaralerta();
                    }
                }
            },
            error=>{
                console.log(<any>error);
            }

        )

    }


    EliminarAlmacen(){
        this._almacenesService.EliminarAlmacen(this.boraralmacen).subscribe(
            result=>{
                this.destruir();
                this.reconstruir();
                console.log(result)
            },
            error=>{
                console.log(<any>error);
            }
        )
    }

    tabla(){
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
    modificaralerta(){
        swal({
            position: 'center',
            icon: "success",
            title: 'se guardo el almacen',
            buttons: false,
            timer: 3000
          })
    }

    borraralerta(id){
        this.boraralmacen=id;
        console.log(this.boraralmacen);
        swal({
            title: "esta seguro",
            text: "despúes de borrar, no se pude recuperar",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                
                this.limpiar();
               this.EliminarAlmacen();
              swal("su producto se borro satisfactoriamente", {
                icon: "success",
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

      
}