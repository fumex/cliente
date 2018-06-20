import { Component } from '@angular/core';
import { OrdenPedidosService } from '../services/Ordendepedido.service';
import { OrdenDePedidoModel} from '../modelos/OrdendePedido';
import { DetalleOrdenPedidosService } from '../../detalle-orden-de-pedido/services/DetalleOrdenPedido.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';

declare var jQuery:any;
declare var $:any;
@Component({
    selector:'pedido-list',
    templateUrl:'../views/ordendepedidolistar.html',
    providers:[OrdenPedidosService,AuthService,DetalleOrdenPedidosService]
})
export class pedidolistarcomponent {
    public title:string;
    public mostrapedido:any=[];
    public mostrapedidodetalle:any=[];
    public confirmado;
    public user:User;
    constructor(
        private _pedidoservice:OrdenPedidosService,
        private _detallepdidoservice:DetalleOrdenPedidosService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService
    ){
        this.user=this.auth.getUser();
        this.title='Lista de Compras';
        this.destruir();
        this.reconstruir();
    }
    ngOnInit(){
        console.log("asdasd"); 
        this.getpedidos(); 
    }
   
    getpedidos(){
        this._pedidoservice.getpedidos().subscribe(
            result=>{
                this.mostrapedido=result;
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    mostrardetalle(id,index){
        this.detalleorden(id,index);

    }
    detalleorden(id,index){
        this._detallepdidoservice.getdetalle(id).subscribe(
            result=>{
                this.mostrapedidodetalle=result;
                console.log(index);
                console.log(this.mostrapedidodetalle);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    agregar(){
         this.router.navigate(['/'+this.user.rol+'/pedido']);        
    }
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#pedido').DataTable({
                    
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ]
                 });
            });
        },3000);
    }
    destruir(){	
        var table = $('#pedido').DataTable(); table .clear() ;
        $('#pedido').DataTable().destroy();
    }
    reconstruir(){
        this.getpedidos();
        this.tabla();
    }

}