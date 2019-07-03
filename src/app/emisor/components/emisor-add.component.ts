import { Component, OnInit } from '@angular/core';
import { EmisorService } from '../services/emisor.service';
import { EmpresaService } from '../../empresa/services/empresa.service';
import { EmpresaModel } from '../../empresa/models/empresa';
import { PermisosRolesModel } from '../../usuarios/modelos/permisos_roles';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { UsuarioService } from '../../usuarios/services/usuarios.service';
import { User } from '../../auth/interfaces/user.model';
import {Router,ActivatedRoute,Params}from '@angular/router';

@Component({
    selector:'emisor-add',
    templateUrl:'../views/emisor-add.html',
    providers:[EmisorService]
})
export class EmisorAddComponent implements OnInit{
    
    public title:string;
    public empresa:EmpresaModel;
    public razonSocial:string;
    public ruc:string;
    public user:User;
    public url2;
    public mandar:PermisosRolesModel;
    constructor(
        private empresaService:EmpresaService,
        private auth:AuthService,
        private _UsuarioService:UsuarioService,
        private _router:Router,
    ){
        this.title='Datos del Emisor';
        this.url2=environment.url+'admin/emisor';
        this.user=this.auth.getUser();
        this.mandar = new PermisosRolesModel(this.user.id,null,this.url2,null,null);
        let i=0;
        this._UsuarioService.getpermisos(this.mandar).subscribe(
            res=>{
                console.log(res)
                if(res.mensaje!=true){
                    this._router.navigate(['/'+this.user.rol]);
                }

            },
            err=>{
                console.log(<any>err);
            }
        );
    }
    ngOnInit(){
        this.getEmpresa();
    }
    getEmpresa(){
        this.empresaService.dataEmpresa().subscribe(
            result=>{
                console.log(result);
                this.empresa=result;
                this.asignarEmpresa(this.empresa);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    
    asignarEmpresa(empresa:EmpresaModel){
        this.razonSocial=empresa.razon_social;
        this.ruc=empresa.ruc;
    }
}