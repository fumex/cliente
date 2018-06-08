import { Component, OnInit } from "@angular/core";
import { DocumentoModel } from "../models/documento";
import { DocumentoService } from "../services/documento.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../auth/services/auth.service";
import { User } from "../../auth/interfaces/user.model";

@Component({
    selector:'documento-add',
    templateUrl:'../views/documento-add.html',
    providers:[DocumentoService]

})
export class TipoDocumentoAddComponent implements OnInit{
    
    public title;
    public documento:DocumentoModel;
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
    }
    ngOnInit(){
        
    }
    onSubmit(){
        this.documentoService.addDocumento(this.documento).subscribe(
            result=>{
                console.log(result);
                this.list();
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
    list(){
        this.router.navigate(['/'+this.user.rol+'/documento/list']);
    }
}