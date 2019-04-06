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
    public confirmado:boolean;
    public user:User;
    public imageUrl:string;
    public filear;
    public archs;
    public filesToUpload:File[];
    public fileToUpload:File=null;
    public archsToUpload:File[];
    public archToUpload:File=null;
    public departamento:Array<any>=[];
    public provincia:Array<any>=[];
    public distrito:Array<any>=[];
    public clave_sol=null;
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
        this.empresa= new EmpresaModel(null,'','','','','','','','','','','',this.user.id,null,false,false,null);
        this.confirmado=true;
        this.filesToUpload=null; 
        this.empresaService.revisarexistencias().subscribe(
            res=>{
                if(res==true){
                    this.router.navigate(['/'+this.user.rol+'/empresa/perfil']);
                }
            },
            err=>{
                console.log(<any>err);
            }
        )
    }
    ngOnInit(){
        this.getubigeos();
        console.log('hola');
    } 
    percepcionfalse(){
        this.empresa.percepcion=false;
    }
    percepciontrue(){
        this.empresa.percepcion=true;
    }
    selectdepartamento(departamento){
        this.empresa.ubigeo=null;
        let i=0
        let j=0;
        while(j<this.distrito.length){
            this.distrito.splice(j,1);
        }
        this.empresaService.getprovincia().subscribe(
            res=>{
                this.provincia=res;
                while(i<this.provincia.length){
                    if(this.provincia[i].departamento==departamento){
                        i++;
                    }else{
                        this.provincia.splice(i,1);
                    }
                }
                console.log(this.provincia);
            },
            err=>{
                console.log(<any>err);
            }
        );
        
    }
    selectprovincia(provincia){
        let i=0;
        this.empresa.ubigeo=null;
        this.empresaService.getall().subscribe(
            res=>{
                console.log(res);
                this.distrito=res;
                while(i<this.distrito.length){
                    if(this.distrito[i].provincia==provincia){
                        i++;
                    }else{
                        this.distrito.splice(i,1);
                    }
                }
                console.log(this.distrito);
            },
            err=>{
                console.log(<any>err);
            }
        );
        
    }
    selectdistrito(distrito){
        let i=0;
        while(i<this.distrito.length){
            if(this.distrito[i].distrito==distrito){
                this.empresa.ubigeo=this.distrito[i].ubigeo;
            }
            i++;
        }
        console.log(this.distrito);
    }
    getubigeos(){
        this.empresaService.getdepartamento().subscribe(
            res=>{
                console.log(res);
                this.departamento=res;
            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    img(ruc){
        let f= new Date();
        let fecha=f.getDate()+"_"+(f.getMonth()+1)+"_"+f.getFullYear()+"_"+f.getMilliseconds();
        let emp=fecha+'_'+ruc;
        return emp;
    }
    addEmpresa(ruc){
        console.log(this.empresa);
        this.empresa.imagen=ruc
        this.empresaService.addEmpresa(this.empresa).subscribe(
            result=>{
                this.addpfx();
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }

    getExtension(filename){
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
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
    viewpfx(file:FileList,fileInput:any){
        this.archs=document.getElementById('archivosunat');
        var archpath=this.archs.value;
        console.log(file[0].size);
        var allowedExtensions = /(.pfx)$/i;
        if(!this.archs.value){
            console.log('nada');
            this.archsToUpload=null;
            this.archToUpload=null;
        }
        else{
            if(!allowedExtensions.exec(archpath)){
                console.log('no entro');
                this.archsToUpload=null;
                this.archToUpload=null;
                this.archs.value="";
                return false;
            }
            else{
                console.log('entro');
                this.archsToUpload=fileInput.target.files;
                this.archToUpload=file.item(0);
            }
        }
    }
    addpfx(){
        this.empresaService.postpfx(this.empresa.ruc,this.archToUpload,this.clave_sol).subscribe(
            result=>{
                console.log(result);
                this.router.navigate(['/'+this.user.rol+'/empresa/perfil']);
            },
            error=>{
                console.log(<any>error);
            }
        ); 
    }
    onSubmit(ruc){
        let _ruc=this.img(ruc);
        this.empresaService.postFile(_ruc,this.fileToUpload).subscribe(
            result=>{
                console.log('imagen agregada');
                let ru=_ruc+'.'+this.getExtension(this.filear.value);
                this.addEmpresa(ru);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    onCancel(){
        console.log('cancelad');
    }
}