import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/Observable';
import {AnularModel}from '../modelos/anular';
import {AnularDetalleModel}from '../modelos/anular_detalle';

@Injectable()
export class AnularService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }
    getserieanular(id):Observable<any>{
        return this._http.get<any>(this.url+'/generarserienota/'+id).shareReplay();
    }
    guardarnotas(anular:AnularModel):Observable<any>{
        let json = JSON.stringify(anular);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/guardarnotacredito',params,{headers:headers});
    }
    guardardetallenotas(anular_d:AnularDetalleModel):Observable<any>{
        let json = JSON.stringify(anular_d);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/guardardetallenotacredito',params,{headers:headers});
    }
    guardarmoveinvendencredito(anular_d:AnularDetalleModel):Observable<any>{
        let json = JSON.stringify(anular_d);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/guardarmoveinvcredito',params,{headers:headers});
    }
    anulaciondeventa(anular_d:AnularDetalleModel):Observable<any>{
        let json = JSON.stringify(anular_d);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/anulacionesydevoluciones/',params,{headers:headers});
    }
}