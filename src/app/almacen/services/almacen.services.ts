import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/observable';
import {almacenstock}from '../modelos/almacen';

@Injectable()
export class AlmaceneService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }

    getAlmacen(){
        return this._http.get<any>(this.url+'/almacen').shareReplay();
    }
    addAlmacen(almacen:almacenstock):Observable<any>{
        let json = JSON.stringify(almacen);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/almacen',params,{headers:headers});
            
    }
    SeleccionarAlmacen(id){
        return this._http.get<any>(this.url+'/almacen/'+id).shareReplay();

    }

 
}