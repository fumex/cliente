import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/observable';
import {inventario}from '../modelos/inventario';

@Injectable()
export class InventarioService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }

    getInventario(){
        return this._http.get<any>(this.url+'/inventario').shareReplay();
    }
    addInventario(inventario:inventario):Observable<any>{
        let json = JSON.stringify(inventario);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/inventario',params,{headers:headers});
            
    }
    SeleccionarInventario(id){
        return this._http.get<any>(this.url+'/inventario/'+id).shareReplay();

    }

 
}