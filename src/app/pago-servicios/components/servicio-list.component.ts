import { Component, OnInit } from '@angular/core';
import { ServicioPagoService } from '../services/servicio.service';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var jQuery:any;
declare var $:any;
@Component({
    selector:'servicio-list',
    templateUrl:'../views/servicio-list.html',
    providers:[ServicioPagoService]

})
export class ServicioListComponent implements OnInit{
    public title:string;
    public servicios:any[];
    public user:User;
    constructor(
        private servicioPago:ServicioPagoService,
        private auth:AuthService,
        private route:ActivatedRoute,
        private router:Router
    ){
        this.user=this.auth.getUser();
        this.title='LISTA SERVICIOS';
        this.tabla();
    }
    ngOnInit(){
       this.listServicios();
    }
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#example').DataTable({
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ],
                 });
            });
        },3000);
     }
     listServicios(){
        this.servicioPago.listServicios().subscribe(
            result=>{
                this.servicios=result;
            }
        );
     }
     agregar(){
         this.router.navigate(['/'+this.user.rol+'/servicio']);
     }
}