import { Component } from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import{AlmacenesService}from '../services/almacenes.service'
import{almacen} from '../modelos/almacenes';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/interfaces/user.model';
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
    public boraralmacen;
    public almacenes:almacen[];
    public editalmacen:almacen;
    public almacen:almacen;
    public user:User
	constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _almacenesService:AlmacenesService,
        private auth:AuthService
        
    ){
        this.titulo = "Almacenes";
        this.tabla();
        this.user=this.auth.getUser();
        this.almacen=new almacen(0,'','','',null,this.user.id);
        this.editalmacen=new almacen(0,'','','',null,this.user.id);
        this.ident=null;
        this.idalmacen=null;
        this.boraralmacen=null;
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
        this.editalmacen=new almacen(0,'','','',null,this.user.id);
        this.almacen=new almacen(0,'','','',null,this.user.id);
    }
    agregaralmacen(){
        this._almacenesService.addAlmacenes(this.almacen).subscribe(
            result=>{
                console.log(result);
                if(result.code===300){
                    this.alertarepetido();
                }else{
                    this.limpiar();
                    this.destruir();
                    this.reconstruir();
                    this.modificaralerta();
                }
            },
            error=>{
                console.log(<any>error);
            }

        )

    }

    alertarepetido(){
        swal({
            position: 'center',
            icon: "warning",
            title: 'el nombre del almacen ya existe',
          })
    }
    EliminarAlmacen(){
        this._almacenesService.EliminarAlmacen(this.boraralmacen).subscribe(
            result=>{
                this.destruir();
                this.reconstruir();
                console.log(result)
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
        this.boraralmacen=id;
        console.log(this.boraralmacen);
        swal({
            title: "esta seguro",
            text: "despúes de borrar, no se pude recuperar",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                
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
        this.mostrar();
        this.tabla();
    
        
    }

      
}