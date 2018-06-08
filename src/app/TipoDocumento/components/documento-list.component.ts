import { Component, OnInit } from '@angular/core';
import { DocumentoService } from '../services/documento.service'
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentoModel } from '../models/documento';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';

declare var jQuery:any;
declare var $:any;
@Component({
    selector:'documento-list',
    templateUrl:'../views/documento-list.html',
    providers:[DocumentoService]
})
export class TipoDocumentoListComponent implements OnInit{
    title='Documentos';
    public documentos:DocumentoModel[];
    public confirmado;
    public user:User;
    constructor(
        private documentoService:DocumentoService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService
    ){
        this.tabla();
        this.user=this.auth.getUser();
        this.confirmado=null;
    }
    ngOnInit(){
        this.getDocumentos();
    }
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
    borrarConfirm(id){
        this.confirmado=id;
    }
    cancelarConfirm(){
        this.confirmado=null;
    }
    edit(id){
        this.router.navigate(['/'+this.user.rol+'/documento/edit',id]);
    }
    agregar(){
        this.router.navigate(['/'+this.user.rol+'/documento']);
    }
}