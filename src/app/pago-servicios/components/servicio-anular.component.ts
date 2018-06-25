import { Component, OnInit } from '@angular/core';
import { ServicioPagoService } from '../services/servicio.service';
import { ServicioAnularModel } from '../models/servicio-anular';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';

declare var swal:any;
declare  var $:any;
@Component({
    selector:'servicio-anular',
    templateUrl:'../views/servicio-anular.html',
    providers:[ServicioPagoService]
})
export class ServicioAnularComponent implements OnInit{

    public title:string;
    public servicio:ServicioAnularModel;
    public servicios:ServicioAnularModel[];
    public code:string;
    public id:number
    public documento:string;
    public nroBoleta:string;
    public tipo_pago:string;
    public nombre_proveedor:string;
    public descripcion:string;
    public subtotal:number;
    public igv:number;
    public fecha:string;
    public user:User;

    public confirmado;
    public val:boolean;
    constructor(
        private anularService:ServicioPagoService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService
    ){
        this.user=this.auth.getUser();
        this.title='ANULAR SERVICIO';
        this.user=this.auth.getUser();
        this.tabla();
        this.confirmado=null;
        this.val=false;
    }
    ngOnInit(){
        this.getServicios();
    }
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#servianu').DataTable();
            });
        },3000);
     }
     getServicios(){
        this.anularService.listServicios().subscribe(
            result=>{
                this.servicios=result;
                console.log(this.servicios);
            },
            error=>{
                console.log(<any>error);
            }
        );
     }
     getServicio(id,cod,documen,nroBoleta,tipo_pago,nombre_proveedor,descripcion,subtotal,igv,created_at){
         this.servicio= new ServicioAnularModel(id,cod,documen,nroBoleta,
                                                tipo_pago,nombre_proveedor,descripcion,
                                                subtotal,igv,created_at);
         this.asignarCampos(this.servicio);
         this.confirmado=id;
         this.val=true;
     }

     asignarCampos(servi:ServicioAnularModel){
        this.id=servi.id;
        this.code=servi.code;
        this.documento=servi.documento;
        this.nroBoleta=servi.nroBoleta;
        this.tipo_pago=servi.tipo_pago;
        this.nombre_proveedor=servi.nombre_proveedor;
        this.descripcion=servi.descripcion;
        this.subtotal=servi.subtotal;
        this.igv=servi.igv;
        this.fecha=servi.created_at;
     }
     anular(){
         this.anularService.deleteServicio(this.id).subscribe(
            result=>{
                console.log(result);
                this.list();
            },
            error=>{
                console.log(<any>error);
            }         
        );
     }
     list(){
        this.router.navigate(['/'+this.user.rol+'/servicio/list']);
    }
    //---------------Alert----------------
    alertaDelete(){
        swal({
            title: "Esta seguro",
            text: "despúes de borrar, no se pude recuperar",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.anular();
                swal({
                    position: 'center',
                    icon: "error",
                    title: 'eliminado...',   
                    timer: 4000,
                    buttons: false,
                });
            } else {
              
            }
          });
    }

}