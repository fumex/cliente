import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/observable';
import {categoria}from '../modelos/categorias';

@Injectable()
export class CategoriaService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }

    getCategoria(){
        return this._http.get<any>(this.url+'/categorias').shareReplay();
    }
    addCategoria(categoria:categoria):Observable<any>{
        let json = JSON.stringify(categoria);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/categorias',params,{headers:headers});
            
    }
    actualizarcategoria(id, categoria:categoria):Observable<any>{
        let params=JSON.stringify(categoria);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'/categorias/'+id,params,{headers:headers});
    }
    selectcategoria(id){
        return this._http.get<any>(this.url+'/categorias/'+id).shareReplay();
    }

 
}