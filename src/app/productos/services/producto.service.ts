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
       
        return this._http.post(this.url+'/productos',params,{headers:headers});
            
    }
    SeleccionarProducto(id){
        return this._http.get<any>(this.url+'/productos/'+id).shareReplay();
    }
<<<<<<< HEAD
    borrarproducto(id){
        return this._http.get<any>(this.url+'/productos/eliminar/'+id).shareReplay();
    }
    Productosupdate(id,producto:producto):Observable<any>{
        let json = JSON.stringify(producto);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/productos/'+id,params,{headers:headers});
    }
=======
    listProductos(){
        return this._http.get<any>(this.url+'/productos-get').shareReplay();
    }

 
>>>>>>> 80834b34817ab682d3ca53ccc7118cd81704645b
}