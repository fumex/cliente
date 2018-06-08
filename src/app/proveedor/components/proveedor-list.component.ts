import { Component, OnInit } from "@angular/core";
import { ProveedorService } from "../services/proveedor.service";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../../auth/interfaces/user.model";
import { AuthService } from "../../auth/services/auth.service";
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
    public user:User;
    constructor(
        private proveedorService:ProveedorService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService
    ){
        this.tabla();
        this.user=this.auth.getUser();
        this.confirmado=null;
    }
    ngOnInit(){
        this.getProveedores();
    }
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#provee').DataTable({
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
        this.router.navigate(['/'+this.user.rol+'/proveedor/edit',id]);
    }
    agregar(){
        this.router.navigate(['/'+this.user.rol+'/proveedor'])
    }
}
