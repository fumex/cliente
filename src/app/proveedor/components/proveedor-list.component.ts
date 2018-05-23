import { Component, OnInit } from "@angular/core";
import { ProveedorService } from "../services/proveedor.service";
import { ActivatedRoute, Router } from "@angular/router";
declare var jQuery:any;
declare var $:any;
@Component({
    selector:'proveedor-list',
    templateUrl:'../views/proveedor-list.html',
    providers:[ProveedorService]

})
export class ProveedorListComponent implements OnInit{
    title='Proveedor';
    public proveedores:any=[];
    public confirmado;
    constructor(
        private proveedorService:ProveedorService,
        private route:ActivatedRoute,
        private router:Router
        
    ){
        this.tabla();
        this.confirmado=null;
    }
    ngOnInit(){
        this.getProveedores();
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
    borrarConfirm(id){
        this.confirmado=id; 
    }
    cancelarConfirm(){
        this.confirmado=null;
    }
    edit(id){
        this.router.navigate(['/admin/proveedor/edit',id]);
    }
}
