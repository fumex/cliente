import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/observable';
import {producto}from '../modelos/productos';

@Injectable()
export class ProductoService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }

    getProductos(){
        return this._http.get<any>(this.url+'/productos').shareReplay();
    }
    addproducto(producto:producto):Observable<any>{
        let json = JSON.stringify(producto);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/productos-add',params,{headers:headers});
            
    }
    

 
}