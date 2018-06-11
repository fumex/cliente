import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/observable';
import {SucursalModel}from '../modelos/sucursal';

@Injectable()
export class SucursalService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }
    getsucursal(){
        return this._http.get<any>(this.url+'/sucursales').shareReplay();
    }
    addsucursal(sucursal:SucursalModel):Observable<any>{
        let json = JSON.stringify(sucursal);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/sucursales',params,{headers:headers});
            
    }
    UpdateSucursal(id,sucursal:SucursalModel):Observable<any>{
        let json = JSON.stringify(sucursal);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/sucursales/'+id,params,{headers:headers});
    }
}