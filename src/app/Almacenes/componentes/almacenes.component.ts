import { Component } from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import{AlmacenesService}from '../services/almacenes.service'
import{almacen} from '../modelos/almacenes';
declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
  selector: 'almacenes',
  templateUrl: '../views/almacenes.component.html',
  providers: [AlmacenesService]
})
export class AlmacenesComponent{
    public titulo:string;
    public ident;
    public idalmacen;
    public almacenes:almacen[];
    public editalmacen:almacen;
    public almacen:almacen;
	constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _almacenesService:AlmacenesService,
        
    ){
        this.titulo = "Almacenes";
        this.tabla();
        this.almacen=new almacen(0,'','','',null);
        this.editalmacen=new almacen(0,'','','',null);
        this.ident=null;
        this.idalmacen=null;
        this.confirmaractualizar(this.idalmacen);
    }
    ngOnInit(){
        this.mostrar();
        this.actualizar(this.ident);
    }  
    actualizar(id){
        this.ident=id;
        console.log(this.ident);
    }
    editarAlmacen(){
        //this.productos=new producto(0,'','','','',null);
        
        console.log(this.editalmacen.id);
        console.log(this.editalmacen);
        this._almacenesService.actualizaralmacen(this.idalmacen,this.editalmacen).subscribe(
            result=>{
                this.mostrar();
                this.limpiar();
                this.destruir();
                this.reconstruir();
                console.log(result);
                console.log(this.editalmacen);
                this.modificaralerta();
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
            this._almacenesService.SeleccionarAlmacen(this.idalmacen).subscribe(
                result=>{
                    this.editalmacen=result;
                    console.log(result);
                },
                error=>{
                    console.log(<any>error);
                }   
            );
            
        }else{
            console.log(this.idalmacen);
        }
      
    }
    cancelar(){
        this.limpiar();
    }
    mostrar(){
        this.limpiar();
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
    limpiar(){
        this.ident=null;
        this.idalmacen=null;
        this.editalmacen=new almacen(0,'','','',null);
    }
    agregaralmacen(){
        this._almacenesService.addAlmacenes(this.almacen).subscribe(
            result=>{
                this.mostrar();
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }

        )

    }


    EliminarAlmacen(){
        this._almacenesService.EliminarAlmacen(this.idalmacen).subscribe(
            result=>{
                this.mostrar();
                
            },
            error=>{
                console.log(<any>error);
            }
        )
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
    modificaralerta(){
        swal({
            position: 'center',
            icon: "success",
            title: 'se guardo el almacen',
            buttons: false,
            timer: 3000
          })
    }
    borraralerta(id){
        this.idalmacen=id;
        swal({
            title: "esta seguro",
            text: "despúes de borrar, no se pude recuperar",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                console.log(this.idalmacen);
                this.limpiar();
               this.EliminarAlmacen();
              swal("su producto se borro satisfactoriamente", {
                icon: "success",
              });
            } else {
              
            }
          });
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