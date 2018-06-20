import { Component } from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import{AlmaceneService}from '../services/almacen.services';
import{almacenstock} from '../modelos/almacen';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';
import{AlmacenesService} from'../../Almacenes/services/almacenes.service';
import{almacen} from'../../Almacenes/modelos/almacenes';

declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
  selector: 'productos-list',
  templateUrl: '../views/almacen.component.html',
  providers: [AlmaceneService,AlmacenesService]
})
export class AlmacenComponent{
    public titulo:string;
    public ident;
    public stoks:almacenstock[];
    public stok:almacenstock;
    public idalmacen;
    public editalmecen:almacenstock;
    public usuario;
    public ocuataralmacenes;
    public almacenes:almacen;
	constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _almacenService:AlmaceneService,
        private auth:AuthService,
        private _almacenesservice:AlmacenesService,
    ){
        this.titulo = "resumen de almacenes";
        this.stok=new almacenstock(0,0,'',0,0,0,0);
        this.editalmecen=new almacenstock(0,0,'',0,0,0,0);
        this.ident=null;
        this.idalmacen=null;
        this.usuario=this.auth.getUser();;
        this.ocuataralmacenes=null;
        this.tablalmacenes();
    }
    ngOnInit(){
        //this.mostrar();
        this.mostraralmacenes();
        this.actualizar(this.ident);
    } 
    mostraralmacenes(){
        this._almacenesservice.mostraalmacenusuario(this.usuario.id).subscribe(
            result=>{
                this.almacenes=result;
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }   
        );
    }
    buscardetalle(id){
        this.ocuataralmacenes=id;
        this.reconstruir();
    } 
    actualizar(id){
        this.ident=id;
        console.log(this.ident);
    }
    mostrar(id){
        this.limpiar();
        this._almacenService.getAlmacen(id).subscribe(
            result=>{
                this.stoks=result;
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }   
        );

    }
    confirmaractualizar(id){
        this.idalmacen=id;
        console.log(this.idalmacen );
        if(this.idalmacen!=null)
        {
            this._almacenService.SeleccionarAlmacen(this.idalmacen).subscribe(
                result=>{
                    this.editalmecen=result;
                    console.log(result);
                },
                error=>{
                    console.log(<any>error);
                }   
            );
            
        }else{
            console.log(this.idalmacen );
        }
      
    }
    editardetallealmacen(){
        console.log(this.editalmecen.id);
        console.log(this.idalmacen);
        this._almacenService.ActualizarAlmacen(this.idalmacen,this.editalmecen).subscribe(
            result=>{
                this.limpiar();
                this.destruir();
                this.reconstruir();
                console.log(result);
                console.log(this.editalmecen);
                this.modificaralerta();
            },
            error=>{
                console.log(<any>error);               
            }
        );
    }
    cerrar(){
        this.ocuataralmacenes=null;
    }
    cancelar(){
        this.limpiar();
    }
    limpiar(){
        this.ident=null;
        this.idalmacen=null;
        this.editalmecen=new almacenstock(0,0,'',0,0,0,0);
    }
    agregaralmacen(){
        this._almacenService.addAlmacen(this.stok).subscribe(
            result=>{
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }

        )

    }
    modificaralerta(){
        swal({
            position: 'center',
            icon: "success",
            title: 'se guardo el precio',
            buttons: false,
            timer: 3000
          })
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
    tablalmacenes(){
        setTimeout(function(){
            $(document).ready(function() {
                 $('#tablalmacenes').DataTable();
            });
        },1500);
    }

    destruir(){	
        var table = $('#mytable').DataTable(); table .clear() ;
        $('#mytable').DataTable().destroy();
    }
    reconstruir(){
        
        this.mostrar(this.ocuataralmacenes);
        this.tabla();
    }
    
      
}