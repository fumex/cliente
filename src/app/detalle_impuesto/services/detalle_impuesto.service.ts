import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/Observable';
import {DetalleImpuestoModel}from '../models/detalle_impuesto';

@Injectable()
export class detalleimpuestoservice{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }


    detalleimpuestosadd(detalle:DetalleImpuestoModel):Observable<any>{
        let json = JSON.stringify(detalle);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/detalleimpuestos',params,{headers:headers});
            
    }
    seleccionardetealleigv(id){
        return this._http.get<any>(this.url+'/detalleimpuestosigv/'+id).shareReplay();

    }
    seleccionardetealleotro(id){
        return this._http.get<any>(this.url+'/detalleimpuestosotro/'+id).shareReplay();
    }

   
    detalleimpuestoseditigv(detalle:DetalleImpuestoModel):Observable<any>{
        let json = JSON.stringify(detalle);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/editdetalleimpuestosigv',params,{headers:headers});
    }
    detalleimpuestoseditotro(detalle:DetalleImpuestoModel):Observable<any>{
        let json = JSON.stringify(detalle);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/editdetalleimpuestosotro',params,{headers:headers});
    }

   
}