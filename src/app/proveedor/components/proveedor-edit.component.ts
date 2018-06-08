import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../services/proveedor.service';
import { ProveedorModel } from '../models/proveedor';
import { ActivatedRoute, Router,Params } from '@angular/router';
import { TipoProveedorModel } from '../models/tipoProveedor';
import { TipoProveedorService } from '../services/tipoProveedor.service';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';

@Component({
 selector:'proveedor-edit',
 templateUrl:'../views/proveedor-add.html',
 providers:[ProveedorService]
})
export class ProveedorEditComponent implements OnInit{

    public titulo:string;
    public proveedor:ProveedorModel;
    public tipos:TipoProveedorModel[];
    public tipo:TipoProveedorModel;
    public estado;
    public user:User;
    constructor(
        private proveedorService:ProveedorService,
        private route:ActivatedRoute,
        private router:Router,
        private tipoProveedorService:TipoProveedorService,
        private auth:AuthService
    ){
        this.user=this.auth.getUser()
        this.titulo='Editar Proveedor',
        this.proveedor= new ProveedorModel(null,'','','','','',null,this.user.id);
        this.estado=true;
    }
    ngOnInit(){
        this.getProveedor();
        this.getTipo();
    }

    getProveedor(){
        this.route.params.forEach((params:Params)=>{
            let id=params['id'];
            console.log(id);
            this.proveedorService.getProveedor(id).subscribe(
                respose=>{
                    this.proveedor=respose;
                    console.log(this.proveedor)
                },
                error=>{
                    console.log(<any>error);
                }
            )
        });
    }
    getAdd(){
        this.estado=false;
    }
    getTipo(){
        this.tipoProveedorService.getTipo().subscribe(
            result=>{
                this.tipos=result;
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    onSubmit(){
        this.route.params.forEach((params:Params)=>{
            let id=params['id'];
            this.proveedorService.updateProveedor(id,this.proveedor).subscribe(
                result=>{
                    this.router.navigate(['/admin/proveedor/list']);
                },
                error=>{
                    console.log(<any>error);
                }
            );
        });
    }
    saveTipo(tipo1:string,operacion:string){
        this.tipo = new TipoProveedorModel(tipo1,operacion,this.user.id);
        console.log(this.tipo);
        this.tipoProveedorService.addTipo(this.tipo).subscribe(
            response=>{
                console.log(response);
                this.exit();
                this.getTipo();
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    exit(){
        this.estado=true;
    }
    onCancel(){
        this.router.navigate(['/admin/proveedor/list']);
    }
}