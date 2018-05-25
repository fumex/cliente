import { Component, OnInit } from '@angular/core';
import { DocumentoService } from '../services/documento.service'
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentoModel } from '../models/documento';

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
    constructor(
        private documentoService:DocumentoService,
        private route:ActivatedRoute,
        private router:Router,
    ){
        this.tabla();
        this.confirmado=null;
    }
    ngOnInit(){
        this.getDocumentos();
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
        },1200);
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
        this.router.navigate(['/admin/documento/edit',id]);
    }
}