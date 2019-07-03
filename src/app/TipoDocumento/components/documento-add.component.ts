import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DocumentoModel } from '../models/documento';
import { DocumentoService } from '../services/documento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/interfaces/user.model';
import { ToastService } from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { PermisosRolesModel } from '../../usuarios/modelos/permisos_roles';
import { UsuarioService } from '../../usuarios/services/usuarios.service';
import { environment } from '../../../environments/environment';

declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'documento-add',
    templateUrl:'../views/documento-add.html',
    providers:[DocumentoService,ToastService,]

})
export class TipoDocumentoAddComponent implements OnInit{
    
    public title;
    public documento:DocumentoModel;
    public documentos:DocumentoModel[];
    public confirmado:boolean;
    public user:User;
    public url2;
    public mandar:PermisosRolesModel;
    constructor(
        private documentoService:DocumentoService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef,
        private _UsuarioService:UsuarioService,
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.title='Documento';
        this.url2=environment.url+'admin/emisor';
        this.user=this.auth.getUser();
        this.mandar = new PermisosRolesModel(this.user.id,null,this.url2,null,null);
        let i=0;
        this._UsuarioService.getpermisos(this.mandar).subscribe(
            res=>{
                console.log(res)
                if(res.mensaje!=true){
                    this.router.navigate(['/'+this.user.rol]);
                }

            },
            err=>{
                console.log(<any>err);
            }
        );
        this.user=this.auth.getUser();
        this.documento= new DocumentoModel(null,'','',this.user.id);
        this.confirmado=true;
        this.tabla();
    }
    ngOnInit(){
        this.getDocumentos();
    }
    onSubmit(){
        this.documentoService.addDocumento(this.documento).subscribe(
            result=>{
                console.log(result);
                this.clearDocumento();
                this.destruir();
                this.alertaSave();
            },
            error=>{
                console.log(<any>error);
                let text="El Documento existe";
                this.toaste.WarningAlert(text,'Error!');
                
            }
        );
    }
    onCancel(){
        this.clearDocumento();
    }
    clearDocumento(){
        this.documento=new DocumentoModel(null,'','',this.user.id);
    }
    //---------------------------------------------------------------------
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#docu').DataTable({
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ]
                 });
            });
        },3000);
    }
    getDocumentos(){
        this.documentoService.getDocumentos().subscribe(
            result=>{
                this.documentos=result;
            },  
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        )
    }
    onDeleteDocumentos(id){
        this.documentoService.deleteDocumento(id).subscribe(
            result=>{
                this.getDocumentos();
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        )
    }
    edit(id){
        this.router.navigate(['/'+this.user.rol+'/documento/edit',id]);
        this.alertaUpdate();
    }
    alertaSave(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Guardado...',
            buttons: false,
            timer: 2000,
        })   
    }
    alertaUpdate(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Cargando...',
            buttons: false,
            timer: 2000,
        })   
    }
    alertaDelete(id){
        let identi=id;
        swal({
            title: "esta seguro",
            text: "despúes de borrar, no se pude recuperar",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.onDeleteDocumentos(identi);
                this.destruir();
                swal({
                    position: 'center',
                    icon: "error",
                    title: 'eliminado...',   
                    timer: 3000,
                    buttons: false,
                });
            } else {
              
            }
          });
    }

    destruir(){	
        var table = $('#docu').DataTable(); table .clear() ;
        $('#docu').DataTable().destroy();
        this.reconstruir();
    }
    reconstruir(){
        this.tabla();
        this.getDocumentos();
    }

}