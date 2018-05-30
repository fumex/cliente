import { Component } from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import{AlmaceneService}from '../services/almacen.services';
import{almacenstock} from '../modelos/almacen';
declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
  selector: 'productos-list',
  templateUrl: '../views/almacen.component.html',
  providers: [AlmaceneService]
})
export class AlmacenComponent{
    public titulo:string;
    public ident;
    public stoks:almacenstock[];
    public stok:almacenstock;
    public idalmacen;
    public editalmecen:almacenstock;
	constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _almacenService:AlmaceneService,
        
    ){
        this.titulo = "resumen de almacenes";
        this.stok=new almacenstock(0,0,'',0,'',0,0);
        this.editalmecen=new almacenstock(0,0,'',0,'',0,0);
        this.ident=null;
        this.idalmacen=null;
        this.tabla();
    }
    ngOnInit(){
        this.mostrar();
        this.actualizar(this.ident);
    }  
    actualizar(id){
        this.ident=id;
        console.log(this.ident);
    }
    mostrar(){
        this.limpiar();
        this._almacenService.getAlmacen().subscribe(
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
                this.mostrar();
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
    cancelar(){
        this.limpiar();
    }
    limpiar(){
        this.ident=null;
        this.idalmacen=null;
        this.editalmecen=new almacenstock(0,0,'',0,'',0,0);
    }
    agregaralmacen(){
        this._almacenService.addAlmacen(this.stok).subscribe(
            result=>{
                this.mostrar();
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
            title: 'se guardo el almacen',
            buttons: false,
            timer: 3000
          })
    }
    tabla(){
        this.mostrar();
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
    destruir(){	
        var table = $('#mytable').DataTable(); table .clear() ;
        $('#mytable').DataTable().destroy();
    }
    reconstruir(){
        this.tabla();
    
        this.mostrar();
    }
      
}