import { Component } from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import{InventarioService}from '../services/inventario.service'
import{AlmacenesService}from '../../Almacenes/services/almacenes.service';
import{ProductoService} from '../../productos/services/producto.service';
import{inventario} from '../modelos/inventario';
import{almacen}from '../../Almacenes/modelos/almacenes';
import{ProductosfiltradoporAlmacenModel} from '../modelos/almacenproducto';


declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
  selector: 'inventario',
  templateUrl: '../views/inventario.component.html',
  providers: [InventarioService,AlmacenesService,ProductoService]
})
export class InventarioComponent{
    public titulo:string;
    public ident;
    public id;
    public almacenselec;
    public inventarios:inventario[];
    public inventario:inventario;
    public inventario2:inventario;
    public movimientos:Array<inventario>=[];
    public almacenes:almacen;
    public almacene:almacen;
    public productos:ProductosfiltradoporAlmacenModel;
    public mostrabproductos;
    public vertablaproductos;
	constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _InventarioService:InventarioService,
        private _almacenesService:AlmacenesService,
        private _ProductoService:ProductoService,
    ){
        this.titulo = "Ajustes de inventario";
        //this.productos=new ProductosfiltradoporAlmacenModel(0,'','',0,0,'',0,0);
        this.inventario=new inventario(0,'','',0,0,0,0,'',0,0);
        this.inventario2=new inventario(0,'','',0,0,0,0,'',0,0);
        this.ident=null;
        this.tabla();
        this.almacenselec=0;
        this.mostrabproductos=0;
        this.vertablaproductos;
        this.id=0;
    }

    ngOnInit(){
        this.mostrar();
        this.mostraralmacen();
        //this.mostrarProducto(this.almacenselec);
        this.mostrarveralmacen(this.almacenselec);
    }  
    cambio(id){
        console.log(id);
        this.mostrabproductos=1;
        this.almacenselec=id;
        this.destruir();
        this.reconstruir();
        //this.tabla();
        
        console.log(this.almacenselec);
        this.mostrarveralmacen(this.almacenselec);
    }
    addcantidad(idente,idpro,cantida){
        this.productos[idente].id=null;
        this.inventario2.id=idente;
        this.inventario2.id_producto=idpro;
        this.inventario2.tipo_movimiento=1;
        this.inventario2.cantidad=cantida;
        this.movimientos.push(this.inventario2);
        console.log(this.inventario);
        /*this.inventario2.id_producto=null;
        this.inventario2.cantidad=null;*/
        this.inventario2=new inventario(0,'','',0,0,0,0,'',0,0);
        console.log(this.productos)
        console.log(this.movimientos);

    }
    quitarcantidad(idindice){
        this.productos[idindice].canti=0;
        //this.pedidos.splice(index,1);
        while(this.id<this.movimientos.length){
            if(this.movimientos[this.id].id===idindice)
            {
               
                this.productos[idindice].id=this.movimientos[this.id].id_producto;
                this.movimientos.splice(this.id,1);
            }
            this.id=this.id+1;
        }
        this.id=0;
        console.log(this.movimientos);
    }
    guardarmoviemientos(){
        while(this.id<this.movimientos.length){
            console.log(this.movimientos[this.id]);
            this.movimientos[this.id].descripcion=this.inventario.descripcion;
            this.movimientos[this.id].id_almacen=this.inventario.id_almacen;
            this.movimientos[this.id].opciones=this.inventario.opciones;
            this.movimientos[this.id].escoja=this.inventario.escoja;
            this.inventario2=this.movimientos[this.id];
            console.log(this.inventario2);

            this._InventarioService.addInventario(this.inventario2).subscribe(
                result=>{
                    this.mostrar();
                    console.log(result);
                    this.almacenselec=null;
                },
                error=>{
                    console.log(<any>error);
                }
    
            )
            this.id=this.id+1
        }
        this.id=0;
    }
    mostrarveralmacen(almacenselec){
        this._almacenesService.veralmacen(this.almacenselec).subscribe(
            response => {
                this.almacene = response;
                console.log(response);
            },
            error => {
                console.log(<any>error);
                }
            );
    }
    actualizar(id){
        this.ident=id;
        console.log(this.almacenselec);
        
    }

    mostrar(){
        this.limpiar();
        this._InventarioService.getInventario().subscribe(
            result=>{
                this.inventarios=result;
                //console.log(result);
            },
            error=>{
                console.log(<any>error);
            }   
        );

    }
    mostraralmacen(){
        this._almacenesService.getAlmacenes().subscribe(
            result=>{
                this.almacenes=result;
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }   
        );

    }

    mostrarProducto(id){
    this._InventarioService.seleccionarproductos(id).subscribe(
        result=>{
            this.productos=result;
            console.log(result);
         },
         error=>{
             console.log(<any>error);
        }   
        );
    }
    limpiar(){
        this.inventario=new inventario(0,'','',0,0,0,0,'',0,0);
    }

    iralmacen(){
        this._router.navigate(['/admin/almacenes']);
    }
    irproducto(){
        this._router.navigate(['/admin/productos']);
    }
    tabla(){
        setTimeout(function(){
            $(document).ready(function() {
                 $('#mytable').DataTable();
            });
        },1500);
    }
    destruir(){	
        var table = $('#mytable').DataTable(); table .clear() ;
        $('#mytable').DataTable().destroy();
    }
    reconstruir(){
        this.tabla();
        this.mostrarProducto(this.almacenselec);
    }
    alertamodificar(id){
        this.ident=id;
        //this.modificarproducto=null;
        //console.log(this.ident + '' + this.modificarproducto);
        swal({
            title: "esta seguro",
            text: "los datos que cambie no podran resttablecerce",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.guardarmoviemientos();
              swal( {
                title: "su ajuste se agrego correctamente",
                text: "puede revisarlo en la ventana de reportes",
                icon: "success",
              });
            } else {
              
            }
          });
    }
}