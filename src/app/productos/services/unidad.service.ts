import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/Observable';
import {UnidadesModel}from '../modelos/unidades';

@Injectable()
export class UnidadService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }

    getunidad(){
        return this._http.get<any>(this.url+'/auth/unidad').shareReplay();
    }
    addunidad(unidad:UnidadesModel):Observable<any>{
        let json = JSON.stringify(unidad);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/auth/unidad',params,{headers:headers});
            
    }
    selectunidad(id){
        return this._http.get<any>(this.url+'/auth/unidad/'+id).shareReplay();
    }

    updateunidad(id,producto:UnidadesModel):Observable<any>{
        let json = JSON.stringify(producto);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/auth/unidad/'+id,params,{headers:headers});
    }

    eliminar(id){
        return this._http.get<any>(this.url+'auth/eliminarunidad/'+id).shareReplay();
    }
}