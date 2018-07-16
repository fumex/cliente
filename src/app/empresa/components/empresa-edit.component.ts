import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { EmpresaService } from '../services/empresa.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { User } from '../../auth/interfaces/user.model';
import { EmpresaModel } from '../models/empresa';
import { AuthService } from '../../auth/services/auth.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { environment } from '../../../environments/environment.prod';

declare var swal:any;
@Component({
    selector:'empresa-edit',
    templateUrl:'../views/empresa-add.html',
    providers:[EmpresaService, ToastService]
})
export class EmpresaEditComponent implements OnInit{
    
    public title:string;
    public user:User;
    public empresa:EmpresaModel;
    public imageUrl:string;
    public img_up:string;
    public url:string;
    public filear;
    public filesToUpload:File[];
    public fileToUpload:File=null;
    constructor(
        private auth:AuthService,
        private route:ActivatedRoute,
        private router:Router,
        private empresaService:EmpresaService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef
    ){
        this.url=environment.api_url;
        this.toastr.setRootViewContainerRef(vcr);
        this.title='Editar Empresa';
        this.user=this.auth.getUser();
        this.empresa= new EmpresaModel(null,'','','','','','','','','','','',this.user.id);
    }
    ngOnInit(){
        this.getEmpresa();
    }

    getEmpresa(){
        this.route.params.forEach((params:Params)=>{
            let id=params['id'];
            console.log(id);
            this.empresaService.getEmpresa(id).subscribe(
                result=>{
                    this.empresa=result;
                    this.image(this.empresa.imagen);
                },
                error=>{
                    console.log(<any>error);
                    let text="Error de conexion";
                    this.toaste.errorAlerta(text,'Error!');
                }
            );
        });
    }
    image(imagen:string){
        this.img_up=imagen;
        this.imageUrl=this.url+'empresa-img/'+imagen;
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
    getExtension(filename){
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
    }
    img(ruc){
        let f= new Date();
        let fecha=f.getDate()+"_"+(f.getMonth()+1)+"_"+f.getFullYear()+"_"+f.getMilliseconds();
        let emp=fecha+'_'+ruc;
        return emp;
    }
    onSubmit(ruc){
        let _ruc=this.img(ruc)
        if(this.filesToUpload==null){
            let ru=this.image;
            this.updateEmpresa(ru);
        }else{
            this.empresaService.postFile(_ruc,this.fileToUpload).subscribe(
                result=>{
                    console.log('imagen agregada');
                    let ru=_ruc+'.'+this.getExtension(this.filear.value);
                    this.updateEmpresa(ru);
                },
                error=>{
                    console.log(<any>error)
                }
            );
        }
    }
    updateEmpresa(ruc){
        this.route.params.forEach((params:Params)=>{
            let id=params['id'];
            this.empresa.imagen=ruc;
            this.empresaService.updateEmpresa(id,this.empresa).subscribe(
                result=>{
                    this.router.navigate(['/'+this.user.rol+'/empresa/perfil']);
                    this.alertaUpdate();
                },
                error=>{
                    console.log(<any>error);
                }
            );
        });
        
    }
    onCancel(){
        this.router.navigate(['/'+this.user.rol+'/empresa/perfil']);
        this.alertaCancel();
    }
    alertaUpdate(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Actualizado: Para ver cambio recarge la pagina',
            buttons: false,
            timer: 2000,
        })   
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
}