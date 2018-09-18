import { Component } from '@angular/core';
import { OrdenPedidosService } from '../services/Ordendepedido.service';
import { OrdenDePedidoModel} from '../modelos/OrdendePedido';

import { DetalleOrdenPedidosService } from '../../detalle-orden-de-pedido/services/DetalleOrdenPedido.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';
import{almacen} from '../../Almacenes/modelos/almacenes';
import {AlmacenesService}from '../../Almacenes/services/almacenes.service';
import { ProveedorService } from '../../proveedor/services/proveedor.service';

declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
    selector:'pedido-list',
    templateUrl:'../views/ordendepedidolistar.html',
    providers:[OrdenPedidosService,AuthService,DetalleOrdenPedidosService]
})
export class pedidolistarcomponent {
    public title:string;
    public mostrapedido:any=[];
    public mostrapedidodetalle:any=[];
    public editarpedido:OrdenDePedidoModel;
    public confirmado;
    public user:User;
    public mostareditar;
    public mostrarformedit;
    public idpedido;
    public provedores:any=[];;
    public almacenes:almacen;
    public fecha2;
    public fechatrue;
    public code:string;
    constructor(
        private _pedidoservice:OrdenPedidosService,
        private _detallepdidoservice:DetalleOrdenPedidosService,
        private _almacenesService:AlmacenesService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService,
        private _proveedorservice:ProveedorService,
    ){
        this.editarpedido=new OrdenDePedidoModel(null,null,null,null,null,null)
        this.user=this.auth.getUser();
        this.title='Lista de Pedidos';
        this.idpedido=0;
        this.mostareditar=null;
        this.mostrarformedit=null;
        this.fecha2=null;
        
    }
    ngOnInit(){
        //this.getCode(); 
        this.reconstruir();
        this.mostraralmacen();
        this.mostrarproveedor();
        this.fechaactual();
    }

    /*getCode(){
        this._pedidoservice.getCodigo().subscribe(
            result=>{
                console.log(result);
                this.code=result;
            },
            error=>{
                console.log(<any>error)
            }
        );
    }*/
    fechaactual(){
        this._pedidoservice.getfecha().subscribe(
            result=>{
                this.fecha2=result.res;
            },
            error=>{
                console.log(<any>error);
            }   
        )
    }
    validarfecha(fecha){
        if(this.fecha2>fecha){
            this.fechatrue=false;
        }else{
            this.fechatrue=true;
        }
    }
    activarmodificar(){
        this.mostareditar=1;
    }
    volvertablapedido(){
        this.mostrarformedit=null;
        this.mostareditar=null;
        this.destruir();
        this.reconstruir();
    }
    guardarpedido(){
        this._pedidoservice.modificarpedido(this.idpedido,this.editarpedido).subscribe(
            result=>{
                console.log(result);
                this.selectorden(this.idpedido);
                this.alertapedidoguardado();
                this.mostareditar=null;
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    cancelarmodificar(){
        this.mostareditar=null;
        this.selectorden(this.idpedido);
    }



    alertaeliminarpedido(id){

        swal({
            title: "esta seguro",
            text: "despúes de borrar, no se pude recuperar",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.eliminarpedido(id);
              swal("su pedido se borro satisfactoriamente", {
                icon: "success",
                buttons: false,
                timer: 3000
              });
            } else {
              
            }
          });
    }
    eliminarpedido(id){
        this._pedidoservice.borrarpedido(id).subscribe(
            result=>{
                console.log(result);
                this.destruir();
                this.reconstruir();
            },
            error=>{
                console.log(<any>error);
            }
        );
    }



    alertaeliminardetalle(id){
        swal({
            title: "esta seguro",
            text: "despúes de borrar, no se pude recuperar",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
      .then((willDelete) => {
        if (willDelete) {
            this.eliminardetalle(id);
          swal("ese producto se elimino de su pedido", {
            icon: "success",
            buttons: false,
            timer: 3000
            });
        } else {
        }
        });
    }
    eliminardetalle(id){
        this._detallepdidoservice.borrardetalle(id).subscribe(
            result=>{
                console.log(result);
                this.destruirdetalle();
                this.reconstruirdetalle(this.idpedido);
            },
            error=>{
                console.log(<any>error);
            }
        );
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
    mostrardetalle(id,index,code){
        this.code=code;
        this.mostrarformedit=1;
        this.idpedido=id;
        this.destruirdetalle();
        this.reconstruirdetalle(id);
        this.selectorden(id);
    }
    mostrarproveedor(){
        this._proveedorservice.getTable().subscribe(
            result=>{
                this.provedores=result;
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }   
        );

    }
    detalleorden(id){
        this._detallepdidoservice.getdetalle(id).subscribe(
            result=>{
                this.mostrapedidodetalle=result;
                console.log(this.mostrapedidodetalle);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    selectorden(id){
        this._pedidoservice.seleccionarpedido(id).subscribe(
            result=>{
                this.editarpedido=result;
                console.log(this.editarpedido);
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
    mostraralmacen(){
        this._almacenesService.mostraalmacenusuario(this.user.id).subscribe(
            result=>{
                this.almacenes=result;
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }   
        );

    }
    destruir(){	
        var table = $('#pedido').DataTable(); table .clear() ;
        $('#pedido').DataTable().destroy();
    }
    reconstruir(){
        this.getpedidos();
        this.tabla();
        
    }
    tabladetalle(){
        setTimeout(function(){
            $(function(){
                 $('#detalle').DataTable();
            });
        },1500);
    }
    destruirdetalle(){	
        var table = $('#detalle').DataTable(); table .clear() ;
        $('#detalle').DataTable().destroy();
    }
    reconstruirdetalle(id){
        this.detalleorden(id)
        this.tabladetalle();
    }
    alertapedidoguardado(){
        swal({
            position: 'center',
            icon: "success",
            title: 'el pedido se modifico con exito',
            buttons: false,
            timer: 1500
          })
    }
    ReciboPDF(id){
        this._pedidoservice.clear();
        this.getPedido(id);
    }

    getPedido(id){
        this._pedidoservice.dataPedido(id).subscribe(
            result=>{
                this.setPedido(result);
                this.router.navigate(['/'+this.user.rol+'/pedido/recibo']);
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    setPedido(pedido:OrdenDePedidoModel){ 
        this._pedidoservice.setOrdenPedido(pedido);
        //this._router.navigate(['/'+this.usuario.rol+'/pedido/recibo']);
    }

}