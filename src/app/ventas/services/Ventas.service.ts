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

    getcodigo_productos(id):Observable<any>{
        return this._http.get<any>(this.url+'/getcodigo_productosporcaja/'+id).shareReplay();
    }
    GuardarVenta(ventas:VentasModel):Observable<any>{
        let json = JSON.stringify(ventas);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/guardarventa',params,{headers:headers});
    }
    getventasfecha(fecha,id):Observable<any>{
        return this._http.get<any>(this.url+'/getventaporfecha/'+fecha+'/'+id).shareReplay();
    }
    getventaporusuario(fecha,id):Observable<any>{
        return this._http.get<any>(this.url+'/getventaporusuario/'+fecha+'/'+id).shareReplay();
    }
    getproductosvendidos(fecha,id):Observable<any>{
        return this._http.get<any>(this.url+'/getproductosvendidos/'+fecha+'/'+id).shareReplay();
    }
    getventasporid(id):Observable<any>{
        return this._http.get<any>(this.url+'/getventaporid/'+id).shareReplay();
    }

    getventasporsucursal(id):Observable<any>{
        return this._http.get<any>(this.url+'/getventaporsucursal/'+id).shareReplay();
    }

    getventashoy():Observable<any>{
        return this._http.get<any>(this.url+'/gteventahoy').shareReplay();
    }

    getventastotales():Observable<any>{
        return this._http.get<any>(this.url+'/getallventas').shareReplay();
    }

    almacennardatosventas(ventas:any,detalle_ventas:any,impuestos:any,codigo:any){
        if(codigo && ventas && detalle_ventas && impuestos){
            localStorage.setItem('ventas',btoa(JSON.stringify(ventas)));
            localStorage.setItem('detalle_ventas',btoa(JSON.stringify(detalle_ventas)));
            localStorage.setItem('impuestos',btoa(JSON.stringify(impuestos)));
            localStorage.setItem('codigo',btoa(JSON.stringify(codigo)));
          return true;
        } 
        return false;
    }
    almacenardato(nombre:string,dato:any){
        localStorage.setItem(nombre,btoa(JSON.stringify(dato)));
    }
    recojerdatos(nombredato):any{
        return localStorage.getItem(nombredato)?JSON.parse(atob(localStorage.getItem(nombredato))):null;
    }
    cleardatos(nombre):void{
        localStorage.removeItem(nombre);
    }
}