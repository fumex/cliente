import { Component, OnInit } from '@angular/core';
import { DocumentoService } from '../services/documento.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DocumentoModel } from '../models/documento';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/interfaces/user.model';

declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'documento-edit',
    templateUrl:'../views/documento-add.html',
    providers:[DocumentoService]
})
export class TipoDocumentoEditComponent implements OnInit{

    public title;
    public documento:DocumentoModel;
    public user:User;
    public confirmado:boolean;
    public documentos:DocumentoModel[];
    constructor(
        private documentoService:DocumentoService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService
    ){
        this.user=auth.getUser();
        this.title='Editar Documento'
        this.documento= new DocumentoModel(null,'','',this.user.id);
        this.confirmado=false;
        this.tabla();
    }
    ngOnInit(){
        this.getDocumento();
        this.getDocumentos();
    }
    getDocumento(){
        this.route.params.forEach((params:Params)=>{
            let id=params['id'];
            console.log(id);
            this.documentoService.getDocumento(id).subscribe(
                response=>{
                    this.documento=response;
                },
                error=>{
                    console.log(<any>error);
                }
            );
        });
    }
    onSubmit(){
        this.route.params.forEach((params:Params)=>{
            let id=params['id'];
            this.documentoService.updateDocumento(id,this.documento).subscribe(
                result=>{
                    this.router.navigate(['/'+this.user.rol+'/documento']);
                    this.alertaUpdate();
                },
                error=>{
                    console.log(<any>error);
                }
            );
        });
    }
    onCancel(){
        this.router.navigate(['/'+this.user.rol+'/documento']);
        this.alertaCancel();
    }
    list(){
        this.onCancel();
    }
    //------------------------------------------------------------------------------------
    tabla(){
        // this.getProveedores();
         setTimeout(function(){
             
             $(function(){
                  $('#provee').DataTable({
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
            }
        );
    }
    
    edit(id){
        this.router.navigate(['/'+this.user.rol+'/documento/edit',id]);
      //  this.alertaSelect();
    }
    alertaCancel(){
        swal({
            position: 'center',
            icon: "error",
            title: 'Cancelado',
            buttons: false,
            timer: 3000,
          })   
    }
    alertaUpdate(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Actualizado',
            buttons: false,
            timer: 3000
          })   
    }  
}