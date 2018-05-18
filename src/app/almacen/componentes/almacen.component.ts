import { Component } from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import{AlmaceneService}from '../services/almacen.services';
import{almacenstock} from '../modelos/almacen';

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
	constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _almacenService:AlmaceneService,
        
    ){
        this.titulo = "resumen de almacenes";
        this.stok=new almacenstock(0,0,0,'',0,0);
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
    limpiar(){
        this.stok=new almacenstock(0,0,0,'',0,0);
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

      
}