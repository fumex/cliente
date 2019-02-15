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
    almacenarnotacredito(anulacion:AnularModel,ventas:any,detalle_ventas:any,impuestos:any){
        if(anulacion && ventas && detalle_ventas && impuestos){
            localStorage.setItem('N_credito',btoa(JSON.stringify(anulacion)));
            localStorage.setItem('ventas',btoa(JSON.stringify(ventas)));
            localStorage.setItem('detalle_ventas',btoa(JSON.stringify(detalle_ventas)));
            localStorage.setItem('impuestos',btoa(JSON.stringify(impuestos)));
          return true;
        }
        return false;
    }
    recogernotacredito():AnularModel{
        return localStorage.getItem('N_credito')?JSON.parse(atob(localStorage.getItem('N_credito'))):null;
    }
    recojerdatos(nombredato):any{
        return localStorage.getItem(nombredato)?JSON.parse(atob(localStorage.getItem(nombredato))):null;
    }
    clear():void{
        localStorage.removeItem('N_credito');
    }
    cleardatos(nombre):void{
        localStorage.removeItem(nombre);
    }
    getidnotacredito():Observable<any>{
        return this._http.get<any>(this.url+'/id_nota_creditos').shareReplay();
    }
    getdetallenotacredito(id):Observable<any>{
        return this._http.get<any>(this.url+'/getdetallenotacredito/'+id).shareReplay();
    }
}