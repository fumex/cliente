import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/Observable';
import {CajasModels}from '../modelos/cajas';

@Injectable()
export class CajasService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }

    getcajas(){
        return this._http.get<any>(this.url+'/cajas').shareReplay();
    }
    addcajas(unidad:CajasModels):Observable<any>{
        let json = JSON.stringify(unidad);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/cajas',params,{headers:headers});
            
    }
    selectcajas(id){
        return this._http.get<any>(this.url+'/cajas/'+id).shareReplay();
    }

    updatecajas(id,producto:CajasModels):Observable<any>{
        let json = JSON.stringify(producto);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/cajas/'+id,params,{headers:headers});
    }
    deletecajas(id){
        return this._http.get<any>(this.url+'/cajas/eliminar/'+id).shareReplay();
    }

}