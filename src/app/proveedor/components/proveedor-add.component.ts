import { Component } from '@angular/core';
import { ProveedorService } from '../services/proveedor.service'; 
import { Proveedor } from '../models/proveedor';

@Component({
    selector:'proveedor-add',
    templateUrl:'../views/proveedor-add.html',
    providers:[ProveedorService]

})
export class ProveedorAddComponent{

    public proveedor:Proveedor;
    public proveedores:Proveedor[];
    constructor(
        private proveedorService:ProveedorService,
    ){
        this.proveedor= new Proveedor('','','','','',1);  
    }
    ngOnInit(){
            this.getProveedores();
    }
    onSubmit(){
        
        this.proveedorService.addProveedor(this.proveedor).subscribe(
            response=>{
                console.log(response);
                this.getProveedores();
                this.clearProveedor();
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    getProveedores(){
        this.proveedorService.getProveedor().subscribe(
            result=>{
                this.proveedores=result;
            },
            error=>{
                console.log(<any>error);
            }
        )
    }
    onCancel(){
        this.clearProveedor();
    }
    clearProveedor(){
        this.proveedor= new Proveedor('','','','','',null);
    }
    
}