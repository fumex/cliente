import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../services/proveedor.service'; 
import { ProveedorModel } from '../models/proveedor';
import { TipoProveedorService } from '../services/tipoProveedor.service';
import { TipoProveedorModel } from '../models/tipoProveedor';

declare var jQuery:any;
declare var $:any;
@Component({
    selector:'proveedor-add',
    templateUrl:'../views/proveedor-add.html',
    providers:[ProveedorService]

})
export class ProveedorAddComponent implements OnInit{
    public estado:boolean;
    public proveedor:ProveedorModel;
    public proveedores:any=[];
    public tipos:TipoProveedorModel[];
    public confirmado;
    public confirmUpdate;
    constructor(
        private proveedorService:ProveedorService,
        private tipoProveedor:TipoProveedorService
    ){
        this.proveedor= new ProveedorModel('','','','','',null);
        this.estado=true;
        this.confirmado=null;
        this.confirmUpdate=null;
        this.tabla();
        
    }
    ngOnInit(){
            this.getProveedores();
            this.getTipo();
            
    }
    actualizarConfirm(id){
        this.confirmUpdate=id;
    }
    borrarConfirm(id){
        this.confirmado=id;
    }
    cancelarConfirm(){
        this.confirmado=null;
    }

    tabla(){
       setTimeout(function(){
           $(function(){
                $('#mytable').DataTable({
                    dom: 'Bfrtip',
                    buttons: [
                        'copy', 'csv', 'excel', 'pdf', 'print'
                    ]
                });
           });
       },3000);
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
                this.getProveedores();
                this.clearProveedor();
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
    getProveedores(){
        this.proveedorService.getTable().subscribe(
            result=>{
                this.proveedores=result;
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
        this.proveedor= new ProveedorModel('','','','','',null);
    }
    onDeleteProveedor(id){
        this.proveedorService.deleteProveedor(id).subscribe(
            result=>{
               // console.log(result);
               this.getProveedores();
            },
            error=>{
                console.log(<any>error);
            }
        )
    }
    
}