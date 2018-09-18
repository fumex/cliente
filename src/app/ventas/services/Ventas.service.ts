import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/Observable';
import {VentasModel}from '../modelos/ventas';

@Injectable()
export class VentasService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }
    obtenerdocumentos():Observable<any>{
        return this._http.get<any>(this.url+'/documentosdeventas').shareReplay();
    }
    
    GuardarVenta(ventas:VentasModel):Observable<any>{
        let json = JSON.stringify(ventas);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/guardarventa',params,{headers:headers});
    }
    getventasfecha(fecha):Observable<any>{
        return this._http.get<any>(this.url+'/getventaporfecha/'+fecha).shareReplay();
    }
}