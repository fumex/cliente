import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SucursalService } from '../services/sucursal.service';
import { AuthService } from '../../auth/services/auth.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { User } from '../../auth/interfaces/user.model';
import { SucursalModel } from '../modelos/sucursal';
import { AlmacenesService } from '../../Almacenes/services/almacenes.service';
import { almacen } from '../../Almacenes/modelos/almacenes';
import { ToastService } from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'sucursal-edit',
    templateUrl:'../views/sucursal-add.html', //reutilizar
    providers:[SucursalService, ToastService]
})
export class SucursalEditComponent implements OnInit{
    
    public title:string;
    public sucursales:any=[];
    public user:User;
    public confirmado:boolean;
    public sucursal:SucursalModel;
    public almacenes:almacen[];
    constructor(
        private auth:AuthService,
        private route:ActivatedRoute,
        private router:Router,
        private sucursalService:SucursalService,
        private almacenService:AlmacenesService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.title='Editar Sucursal'
        this.user=this.auth.getUser();
        this.tabla();
        this.sucursal=new SucursalModel(null,'',null,'','','','',this.user.id);
        this.confirmado=false;
    }
    ngOnInit(){
        this.getSucursales();
        this.getSucursal();
        this.getAlamcenes();
    }

    getSucursal(){
        this.route.params.forEach((params:Params)=>{
            let id=params['id'];
            console.log(id);
            this.sucursalService.findSucursal(id).subscribe(
                result=>{
                    this.sucursal=result;
                    console.log(this.sucursal);
                },
                error=>{
                    console.log(<any>error);
                    let text="Error de conexion";
                    this.toaste.errorAlerta(text,'Error!');
                }
            );
        });
    }
    onSubmit(){
        this.route.params.forEach((params:Params)=>{
            let id=params['id'];
            this.sucursalService.updateSucursal(id,this.sucursal).subscribe(
                result=>{
                    console.log(result);
                    this.onCancel();
                    this.alertaUpdate();
                },
                error=>{
                    console.log(<any>error);
                    let text="La sucursal existe";
                    this.toaste.WarningAlert(text,'Error!');
                }
            );
        });
    }
    //-------------------Listar-------------------------------------
    getSucursales(){
        this.sucursalService.listSucursales().subscribe(
            result=>{
                this.sucursales=result;
                console.log(this.sucursales);
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        );
    }

    tabla(){
        // this.getProveedores();
         setTimeout(function(){
             
             $(function(){
                  $('#sucur').DataTable({
                      dom: 'Bfrtip',
                      buttons: [
                          'copy', 'csv', 'excel', 'pdf', 'print'
                      ]
                  });
             });
         },3000);
    }
    edit(id){
        this.router.navigate(['/'+this.user.rol+'/sucursal/edit/',id]);
        
    }
    onCancel(){
        this.router.navigate(['/'+this.user.rol+'/sucursal']);
        this.alertaCancel();
    }
    //---------------Alamcenes--------------------------------
    getAlamcenes(){
        this.almacenService.getAlmacenes().subscribe(
            result=>{
                this.almacenes=result;
                console.log(this.almacenes);
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        );
    }
    //--------------------Alert---------------------------------------
    alertaUpdate(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Actualizado',
            buttons: false,
            timer: 2000,
        })   
    }
    alertaCancel(){
        swal({
            position: 'center',
            icon: "error",
            title: 'Cancelado',
            buttons: false,
            timer: 3000,
          })   
    }
}