import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/observable';
import {almacen}from '../modelos/almacenes';

@Injectable()
export class AlmacenesService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }

    getAlmacenes(){
        return this._http.get<any>(this.url+'/almacenes').shareReplay();
    }
    addAlmacenes(almacen:almacen):Observable<any>{
        let json = JSON.stringify(almacen);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/almacenes',params,{headers:headers});
            
    }
    veralmacen(id){
        return this._http.get<any>(this.url+'/veralmacen/'+id).shareReplay();
            
    }
    actualizaralmacen(id,almacen:almacen):Observable<any>{
        let json = JSON.stringify(almacen);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/almacenes/'+id,params,{headers:headers});
    }
    EliminarAlmacen(id){
        return this._http.get<any>(this.url+'/almacenes/eliminar/'+id).shareReplay();
    }
    SeleccionarAlmacen(id){
        return this._http.get<any>(this.url+'/almacenes/'+id).shareReplay();

    }
    mostraalmacenusuario(id):Observable<any>{
        return this._http.get<any>(this.url+'/mostralamacenusuario/'+id).shareReplay();
       
    }
 
}