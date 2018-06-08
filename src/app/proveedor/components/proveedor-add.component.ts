import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../services/proveedor.service'; 
import { ProveedorModel } from '../models/proveedor';
import { TipoProveedorService } from '../services/tipoProveedor.service';
import { TipoProveedorModel } from '../models/tipoProveedor';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/interfaces/user.model';


@Component({
    selector:'proveedor-add',
    templateUrl:'../views/proveedor-add.html',
    providers:[ProveedorService]

})
export class ProveedorAddComponent implements OnInit{
    public title:string;
    public estado:boolean;
    public proveedor:ProveedorModel;
    public tipos:TipoProveedorModel[];
    public tipo:TipoProveedorModel;
    public user:User;
   
    constructor(
        private proveedorService:ProveedorService,
        private tipoProveedor:TipoProveedorService,
        private auth:AuthService,
        private  route:ActivatedRoute,
        private router:Router,
    ){
        this.user=auth.getUser();
        this.proveedor= new ProveedorModel(null,'','','','','',null,this.user.id);
        this.estado=true;
        this.tipo = new TipoProveedorModel(null,null,null);
        this.title="Proveedor"   
    }
    ngOnInit(){
            
        this.getTipo();
            
    }

    getAdd(){
        this.estado=false;
    }
    getExit(){
        this.estado=true;
        this.getTipo();
    }
    
    onSubmit(){
        this.proveedorService.addProveedor(this.proveedor).subscribe(
            response=>{
                console.log(response);
                this.proveedoress();
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    getTipo(){
        this.tipoProveedor.getTipo().subscribe(
            result=>{
                this.tipos=result;
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    saveTipo(tipo1:string,operacion:string){
        this.tipo = new TipoProveedorModel(tipo1, operacion,this.user.id);
        console.log(this.tipo);
        this.tipoProveedor.addTipo(this.tipo).subscribe(
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
        this.clearProveedor();
    }
    clearProveedor(){
        this.proveedor= new ProveedorModel(null,'','','','','',null,this.user.id);
    }
    proveedoress(){
        this.router.navigate(['/'+this.user.rol+'/proveedor/list'])
    }  
}