import { Component, OnInit } from "@angular/core";
import { DocumentoModel } from "../models/documento";
import { DocumentoService } from "../services/documento.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../auth/services/auth.service";
import { User } from "../../auth/interfaces/user.model";

declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'documento-add',
    templateUrl:'../views/documento-add.html',
    providers:[DocumentoService]

})
export class TipoDocumentoAddComponent implements OnInit{
    
    public title;
    public documento:DocumentoModel;
    public documentos:DocumentoModel[];
    public confirmado:boolean;
    public user:User;
    constructor(
        private documentoService:DocumentoService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService
    ){
        this.title='Documento';
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
        },2000);
    }
    getDocumentos(){
        this.documentoService.getDocumentos().subscribe(
            result=>{
                this.documentos=result;
            },  
            error=>{
                console.log(<any>error);
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