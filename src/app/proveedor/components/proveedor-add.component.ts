import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../services/proveedor.service'; 
import { ProveedorModel } from '../models/proveedor';
import { TipoProveedorService } from '../services/tipoProveedor.service';
import { TipoProveedorModel } from '../models/tipoProveedor';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
    selector:'proveedor-add',
    templateUrl:'../views/proveedor-add.html',
    providers:[ProveedorService]

})
export class ProveedorAddComponent implements OnInit{
    public estado:boolean;
    public proveedor:ProveedorModel;
    public tipos:TipoProveedorModel[];
   
    constructor(
        private proveedorService:ProveedorService,
        private tipoProveedor:TipoProveedorService,
        private  route:ActivatedRoute,
        private router:Router
    ){
        this.proveedor= new ProveedorModel(null,'','','','','',null);
        this.estado=true;   
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
                this.router.navigate(['/admin/proveedor/list']);
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
    
    onCancel(){
        this.clearProveedor();
    }
    clearProveedor(){
        this.proveedor= new ProveedorModel(null,'','','','','',null);
    }  
}