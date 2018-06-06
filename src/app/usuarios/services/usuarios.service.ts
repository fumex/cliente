import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/observable';
import {UsuarioModel}from '../modelos/usuarios';

@Injectable()
export class UsuarioService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }
    addusuario(usuario:UsuarioModel):Observable<any>{
        let json = JSON.stringify(usuario);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/mantenimientousuario',params,{headers:headers});
            
    }
    updateusuario(id,usuario:UsuarioModel):Observable<any>{
        let json = JSON.stringify(usuario);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/mantenimientousuario/'+id,params,{headers:headers});
    }
}