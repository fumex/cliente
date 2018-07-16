import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/Observable';
import {DetalleCajasUsuariosModels}from '../modelos/detalle_cajas_usuario';

@Injectable()
export class DetalleCajasUsuarioService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }

    
    adddetallecajasusuario(unidad:DetalleCajasUsuariosModels):Observable<any>{
        let json = JSON.stringify(unidad);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/detalle_caja_usuarios',params,{headers:headers});
            
    }
    selectcajasusuario(id){
        return this._http.get<any>(this.url+'/detalle_caja_usuarios/'+id).shareReplay();
    }
    selectusuariocajas(id){
        return this._http.get<any>(this.url+'/getcajasporusuario/'+id).shareReplay();
    }
    updatecajasusuario(producto:DetalleCajasUsuariosModels):Observable<any>{
        let json = JSON.stringify(producto);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/editar_detalle_caja_usuarios',params,{headers:headers});
    }

}