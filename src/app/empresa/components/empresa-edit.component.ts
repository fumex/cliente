import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { EmpresaService } from '../services/empresa.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { User } from '../../auth/interfaces/user.model';
import { EmpresaModel } from '../models/empresa';
import { AuthService } from '../../auth/services/auth.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { environment } from '../../../environments/environment.prod';
import { PermisosRolesModel } from '../../usuarios/modelos/permisos_roles';
import { UsuarioService } from '../../usuarios/services/usuarios.service';

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
    public departamento:Array<any>=[];
    public provincia:Array<any>=[];
    
    public distrito:Array<any>=[];
    public url2;
    public mandar:PermisosRolesModel;
    public verpag=null;
    constructor(
        private auth:AuthService,
        private route:ActivatedRoute,
        private router:Router,
        private _router:Router,
        private empresaService:EmpresaService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef,
        private _UsuarioService:UsuarioService,
    ){
       
        this.url2=environment.url+'admin/empresa/edit';
        this.user=this.auth.getUser();
        this.mandar = new PermisosRolesModel(this.user.id,null,this.url2,null,null);
        let i=0; 
        this._UsuarioService.getpermisos(this.mandar).subscribe(
            res=>{
                console.log(res)
                if(res.mensaje==true){
                    this.verpag=true;
                }else{
                    if(res.mensaje!=false){
                        this.verpag=true;
                        
                    }else{
                        this._router.navigate(['/'+this.user.rol]);
                    }
                }   
               
            },
            err=>{
                console.log(<any>err);
            }
        )
        this.url=environment.api_url;
        this.toastr.setRootViewContainerRef(vcr);
        this.title='Editar Empresa';
        this.user=this.auth.getUser();
        this.empresa= new EmpresaModel(null,'','','','','','','','','','','',this.user.id,null,false,false,null);
    }
    ngOnInit(){
        this.getEmpresa();
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
    getEmpresa(){
        this.route.params.forEach((params:Params)=>{
            let id=params['id'];
            console.log(id);
            this.empresaService.dataEmpresa().subscribe(
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
    percepcionfalse(){
        this.empresa.percepcion=false;
    }
    percepciontrue(){
        this.empresa.percepcion=true;
    }
    image(imagen:string){
        this.img_up=imagen;
        this.imageUrl=this.url+'/empresa-img/'+imagen;
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