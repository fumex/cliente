import { Component } from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import{AlmacenesService}from '../services/almacenes.service'
import{almacen} from '../modelos/almacenes';

@Component({
  selector: 'productos-list',
  templateUrl: '../views/almacenes.component.html',
  providers: [AlmacenesService]
})
export class AlmacenesComponent{
    public titulo:string;
    public ident;
    public almacenes:almacen[];
    public almacen:almacen;
	constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _almacenesService:AlmacenesService,
        
    ){
        this.titulo = "Almacenes";
        this.almacen=new almacen(0,'','','',null);
        this.ident=null;
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
        this.almacen=new almacen(0,'','','',null);
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

      
}