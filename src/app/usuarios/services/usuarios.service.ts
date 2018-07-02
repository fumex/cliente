import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/Observable';
import {UsuarioModel}from '../modelos/usuarios';
import { Http, RequestOptions, Headers } from '@angular/http';

@Injectable()
export class UsuarioService{
    public url:string;
    constructor(
        public _http:HttpClient,
        public http:Http
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
    updateusuarioclave(id,usuario:any){
        let json = JSON.stringify(usuario);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/modificarpas/'+id,params,{headers:headers});
    }
    getusuario(id){
        return this._http.get<any>(this.url+'/usuario/'+id).shareReplay();
        
    }
    usuarios(){
        return this._http.get<any>(this.url+'/usuario').shareReplay();
        
    }
    deshabilitarusuario(id){
        return this._http.get<any>(this.url+'/eliminarusuario/'+id).shareReplay();
        
    }
    insertariamgen( listas: Array<File>,dni){
        if(listas.length>0){
            let file:File=listas[0];
            let formdata:FormData=new FormData();
            
            formdata.append('photo',file,file.name);
            formdata.append('dni',dni);
            
            let headers = new HttpHeaders();
            headers.append('Content-Type', 'application/json');
            //let options = new RequestOptions({ headers: headers });
            return this._http.post(this.url+'/imagenes', formdata,{headers:headers} ).shareReplay();
            
        }
    }
    mostaraimagen(name){
        return this._http.get<any>(this.url+'/imagenes/'+name).shareReplay();
    }
}