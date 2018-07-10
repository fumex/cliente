import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { EmpresaService } from '../services/empresa.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { EmpresaModel } from '../models/empresa';
import { User } from '../../auth/interfaces/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ToastsManager } from 'ng2-toastr';
import { environment } from '../../../environments/environment.prod';

declare var jQuery:any;
declare var $:any;
@Component({
    selector:'empresa-perfil',
    templateUrl:'../views/empresa-perfil.html',
    providers:[EmpresaService,ToastService]
})
export class EmpresaPerfilComponent implements OnInit{

    public title:string;
    public  empresa:EmpresaModel;
    public user:User;
    public confirmado:boolean;
    public filear;
    public filesToUpload:File[];
    public fileToUpload:File=null;
    public imageUrl:string;
    public id:number;
    public nombre:string;
    public ruc:string;
    public direccion:string;
    public departamento:string;
    public provincia:string;
    public distrito:string;
    public telefono1:string;
    public telefono2:string;
    public web:string;
    public email:string;
    public image:string;
    public url;

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
        this.confirmado=true;
        this.filesToUpload=null;
        this.url=environment.api_url;
    }
    ngOnInit(){
        this.getEmpresa();
        this.recargar();
    }

    getEmpresa(){
        this.empresaService.dataEmpresa().subscribe(
            result=>{
                this.empresa=result;
                this.asignacionCampos(this.empresa);
                this.imageUrl=this.url+'empresa-img/'+this.image;
                console.log(this.imageUrl);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    asignacionCampos(empresa:EmpresaModel){
        this.id=empresa.id;
        this.nombre=empresa.nombre;
        this.ruc=empresa.ruc;
        this.direccion=empresa.direccion;
        this.departamento=empresa.departamento;
        this.provincia=empresa.provincia;
        this.distrito=empresa.distrito;
        this.telefono1=empresa.telefono1;
        this.telefono2=empresa.telefono2;
        this.web=empresa.web;
        this.email=empresa.web;
        this.image=empresa.imagen;
    }
    edit(){
        this.router.navigate(['/'+this.user.rol+'/empresa/edit/'+this.id]);
    }
    recargar(){
        $('#galeria').load();
    }
}