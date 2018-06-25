import { Component, OnInit } from "@angular/core";
import { SucursalService } from "../services/sucursal.service";
import { SucursalModel } from "../modelos/sucursal";
import { User } from "../../auth/interfaces/user.model";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../auth/services/auth.service";
import { almacen } from "../../Almacenes/modelos/almacenes";
import { AlmacenesService } from "../../Almacenes/services/almacenes.service";

declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'sucursal-add',
    templateUrl:'../views/sucursal-add.html',
    providers:[SucursalService]
})
export class SucursalAddComponent implements OnInit{
    public title:string;
    public sucursal:SucursalModel;
    public user:User;
    public sucursales:any[];
    public almacenes:almacen[];
    public confirmado:boolean;
    constructor(
        private sucursalService:SucursalService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService,
        private almacenService:AlmacenesService
    ){
        this.confirmado=true;
        this.title="AGREGAR SUCURSAL";
        this.user=this.auth.getUser();
        this.sucursal=new SucursalModel(null,'',null,'','','',this.user.id);
        this.tabla();
    }
    ngOnInit(){
        this.getSucursales();
        this.getAlamcenes();
    }
    onSubmit(){
        this.sucursalService.addSucursal(this.sucursal).subscribe(
            result=>{
                console.log(result);
                this.onCancel();
                this.destruir();
                this.alertaSave();
            },
            error=>{
                console.log(<any>error);
                if(error.status===500){
                    console.log('exite sucursal');
                }
            }
        )
    }
    onDeleteSucusal(id){
        this.sucursalService.deleteSucusal(id).subscribe(
            result=>{
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }

    onCancel(){
        this.sucursal= new SucursalModel(null,'',null,'','','',this.user.id);
    }

    //--------------------Listado de sucursales-----------------------------------
    getSucursales(){
        this.sucursalService.listSucursales().subscribe(
            result=>{
                this.sucursales=result;
                console.log(this.sucursales);
            },
            error=>{
                console.log(<any>error);
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
        this.router.navigate(['/'+this.user.rol+'/sucursal/edit',id]);
        this.alertaUpdate();
    }
    //-----------------------list Almacenes-----------------------------
    getAlamcenes(){
        this.almacenService.getAlmacenes().subscribe(
            result=>{
                this.almacenes=result;
                console.log(this.almacenes);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    //----------------------Alert----------------------------------------
    alertaUpdate(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Cargando...',
            buttons: false,
            timer: 2000,
        })   
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
                this.onDeleteSucusal(identi);
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
        var table = $('#sucur').DataTable(); table .clear() ;
        $('#sucur').DataTable().destroy();
        this.reconstruir();
    }
    reconstruir(){
        this.tabla();
        this.getSucursales();
    }
}