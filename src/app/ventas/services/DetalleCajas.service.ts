import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/Observable';
import {DetalleCaja}from '../modelos/detalle_almacen';

@Injectable()
export class DetalleCajasService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }
    CierreCaja(dcaja:DetalleCaja):Observable<any>{
        let json = JSON.stringify(dcaja);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/cierre',params,{headers:headers});
    }
    AperturaCaja(dcaja:DetalleCaja):Observable<any>{
        let json = JSON.stringify(dcaja);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/apertura',params,{headers:headers});
    }

}