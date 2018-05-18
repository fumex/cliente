import { Component, OnInit } from '@angular/core';
import { PagoService } from '../services/pago.service';

declare var jQuery:any;
declare var $:any;
@Component({
    selector:'pago-list',
    templateUrl:'../views/pago-list.html',
    providers:[PagoService]
})
export class PagoListComponent implements OnInit{

    public title:string;
    constructor(){
        this.title='Lista de Compras';
        this.tabla();
    }
    ngOnInit(){

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
}