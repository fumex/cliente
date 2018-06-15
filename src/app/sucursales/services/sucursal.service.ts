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
    addSucursal(sucursal:SucursalModel):Observable<any>{
        let params = JSON.stringify(sucursal);
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'/sucursal-add',params,{headers:headers});    
    }
    updateSucursal(id,sucursal:SucursalModel):Observable<any>{
        let params  = JSON.stringify(sucursal);
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'/sucursal-update/'+id,params,{headers:headers});
    }
    deleteSucusal(id):Observable<any>{
        return this._http.get(this.url+'/sucursal-delete/'+id).shareReplay();
    }
    findSucursal(id):Observable<any>{
        return this._http.get(this.url+'/sucursal/'+id).shareReplay();
    }
}