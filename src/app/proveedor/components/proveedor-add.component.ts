import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../services/proveedor.service'; 
import { ProveedorModel } from '../models/proveedor';
import { TipoProveedorService } from '../services/tipoProveedor.service';
import { TipoProveedorModel } from '../models/tipoProveedor';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/interfaces/user.model';

declare var jQuery:any;
declare var $:any;
declare var swal:any;
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
    public proveedores:any=[];
    public confirmado:boolean;
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
        this.confirmado=true;
        this.tabla();  
    }
    ngOnInit(){
            
        this.getTipo();
        this.getProveedores(); 
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
                this.clearProveedor();
                this.destruir();
                this.alertaSave();
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
    //----------------------Lista--------------------------------------
    tabla(){
        // this.getProveedores();
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
               //this.getProveedores();
            },
            error=>{
                console.log(<any>error);
            }
        )
    }
    
    edit(id){
        this.router.navigate(['/'+this.user.rol+'/proveedor/edit',id]);
        this.alertaUpdate();
    }
    alertaSave(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Guardado...',
            buttons: false,
            timer: 2000,
        })   
    }
    alertaUpdate(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Cargando...',
            buttons: false,
            timer: 2000,
        })   
    }
    alertaDelete(id){
        let identi=id;
        swal({
            title: "esta seguro",
            text: "despúes de borrar, no se pude recuperar",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.onDeleteProveedor(identi);
                this.destruir();
                swal({
                    position: 'center',
                    icon: "error",
                    title: 'eliminado...',   
                    timer: 3000,
                    buttons: false,
                });
            } else {
              
            }
          });
    }
    destruir(){	
        var table = $('#provee').DataTable(); table .clear() ;
        $('#provee').DataTable().destroy();
        this.reconstruir();
    }
    reconstruir(){
        this.tabla();
        this.getProveedores();
    }
}