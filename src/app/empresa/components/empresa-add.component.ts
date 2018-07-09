import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { EmpresaService } from '../services/empresa.service';
import { EmpresaModel } from '../models/empresa';
import { User } from '../../auth/interfaces/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr';
declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'empresa-add',
    templateUrl:'../views/empresa-add.html',
    providers:[EmpresaService,ToastService]
})
export class EmpresaAddComponent implements OnInit{

    public title:string;
    public empresa:EmpresaModel;
    public empresas:EmpresaModel[];
    public confirmado:boolean;
    public user:User;
    public imageUrl:string;

    public filear;
    public filesToUpload:File[];
    public fileToUpload:File=null;
    constructor(
        private empresaService:EmpresaService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.title='Empresa';
        this.imageUrl=="/assets/images/2.png";
        this.user=this.auth.getUser();
        this.empresa= new EmpresaModel(null,'','','','','','','','','','','',this.user.id);
        this.confirmado=true;
        this.filesToUpload=null; 
    }
    ngOnInit(){
        console.log('hola');
    }
    img(ruc){
        let f= new Date();
        let fecha=f.getDate()+"-"+(f.getMonth()+1)+"-"+f.getFullYear()+"-"+f.getSeconds();
        let emp=fecha+'-'+ruc;
        return emp; 
    }
    addEmpresa(ruc){
        this.empresa.imagen=this.img(ruc);
        this.empresaService.addEmpresa(this.empresa).subscribe(
            result=>{
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    viewImage(file:FileList,fileInput:any){
        this.filear=document.getElementById('image');
        var filePath=this.filear.value;
        console.log(file[0].size);
        var allowedExtensions = /(.jpg|.jpeg|.png)$/i;
        if(!this.filear.value){
            console.log('nada');
            this.filesToUpload=null;
        }
        else{
            if(file[0].size>2000000){
                console.log('no entro');
                this.filesToUpload=null;
                this.filear.value="";
            }
            else{
                if(!allowedExtensions.exec(filePath)){
                    console.log('no entro');
                    this.filesToUpload=null;
                    this.filear.value="";
                    return false;
                }
                else{
                    console.log('entro');
                    this.filesToUpload=fileInput.target.files;
                    this.fileToUpload=file.item(0);
                    var reader = new FileReader();
                    reader.onload=(event:any)=>{
                        this.imageUrl=event.target.result;
                    }
                    reader.readAsDataURL(this.fileToUpload);
                }
            }
        }
    }
    onSubmit(ruc){
        let _ruc=this.img(ruc);
        if(this.filesToUpload==null){
            
        }
        else{
            this.empresaService.postFile(_ruc,this.fileToUpload).subscribe(
                result=>{
                    console.log('imagen agregada');
                    this.addEmpresa(_ruc);
                },
                error=>{
                    console.log(<any>error);
                }
            );
        }
    }
}