import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/Observable';
import {DetalleUsuarioModel}from '../modelos/DetalleUsuario';

@Injectable()
export class DettaleUsuarioService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }
    getdetalleusuario(){
        return this._http.get<any>(this.url+'/detalleusuario').shareReplay();
    }
    adddetalleusuario(usuario:DetalleUsuarioModel):Observable<any>{
        let json = JSON.stringify(usuario);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/detalleusuario',params,{headers:headers});
            
    }
    updatedetalleusuario(usuario:DetalleUsuarioModel):Observable<any>{
        let json = JSON.stringify(usuario);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/modificardetalleusuario',params,{headers:headers});
    }
    seleccionardetalleusuario(id){
        return this._http.get<any>(this.url+'/detalleusuario/'+id).shareReplay();
    }
    seleccionardetalleusuarioporsucursal(id){
        return this._http.get<any>(this.url+'/detalleusersucursal/'+id).shareReplay();
    }
    seleccionardetalleusuarioactual(id){
        return this._http.get<any>(this.url+'/detalleuseractual/'+id).shareReplay();
    }
}