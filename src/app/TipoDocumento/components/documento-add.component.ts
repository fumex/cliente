import { Component, OnInit } from "@angular/core";
import { DocumentoModel } from "../models/documento";
import { DocumentoService } from "../services/documento.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector:'documento-add',
    templateUrl:'../views/documento-add.html',
    providers:[DocumentoService]

})
export class TipoDocumentoAddComponent implements OnInit{
    
    public title;
    public documento:DocumentoModel;
    constructor(
        private documentoService:DocumentoService,
        private route:ActivatedRoute,
        private router:Router
    ){
        this.title='Documento';
        this.documento= new DocumentoModel(null,'','');
    }
    ngOnInit(){
        
    }
    onSubmit(){
        this.documentoService.addDocumento(this.documento).subscribe(
            result=>{
                console.log(result);
                this.router.navigate(['/admin/documento/list']);
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
        this.documento=new DocumentoModel(null,'','');
    }
}