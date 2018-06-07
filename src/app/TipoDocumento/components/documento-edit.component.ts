import { Component, OnInit } from '@angular/core';
import { DocumentoService } from '../services/documento.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DocumentoModel } from '../models/documento';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/interfaces/user.model';

@Component({
    selector:'documento-edit',
    templateUrl:'../views/documento-add.html',
    providers:[DocumentoService]
})
export class TipoDocumentoEditComponent implements OnInit{

    public title;
    public documento:DocumentoModel;
    public user:User;
    constructor(
        private documentoService:DocumentoService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService
    ){
        this.user=auth.getUser();
        this.title='Editar Documento'
        this.documento= new DocumentoModel(null,'','',this.user.id);
    }
    ngOnInit(){
        this.getDocumento();
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
                    this.router.navigate(['/admin/documento/list']);
                },
                error=>{
                    console.log(<any>error);
                }
            );
        });
    }
    onCancel(){
        this.router.navigate(['/admin/documento/list']);
    }
}