import { Component, OnInit } from '@angular/core';
import { ServicioPagoService } from '../services/servicio.service';

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
    constructor(
        private servicioPago:ServicioPagoService
    ){
        this.title='LISTA SERVICIOS';
        this.tabla();
    }
    ngOnInit(){
       this.listServicios();
    }
    tabla(){
        var dataSet=this.listServicios();
        setTimeout(function(){
            $(function(){
                 $('#mytable').DataTable({
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ],
                     data:dataSet
                 });
            });
        },300);
     }
     listServicios(){
        this.servicioPago.listServicios().subscribe(
            result=>{
                this.servicios=result;
            }
        );
     }
}