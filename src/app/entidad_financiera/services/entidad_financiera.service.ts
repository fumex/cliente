import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/Observable';
import {EntidadFinancieraModel}from '../models/entidad_financiera';

@Injectable()
export class EntidadFinancieraService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }

    entidades(){
        return this._http.get<any>(this.url+'/Entidades').shareReplay();
    }
    addentidad(entidad:EntidadFinancieraModel):Observable<any>{
        let json = JSON.stringify(entidad);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/addentidad',params,{headers:headers});
            
    }
    getentidad(id){
        return this._http.get<any>(this.url+'/getentidad/'+id).shareReplay();
    }

    updateentidad(id,entidad:EntidadFinancieraModel):Observable<any>{
        let json = JSON.stringify(entidad);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/editentidad/'+id,params,{headers:headers});
    }

    eliminar(id){
        return this._http.get<any>(this.url+'/deleteentidad/'+id).shareReplay();
    }
}


































