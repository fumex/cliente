import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/observable';
import {OrdenDePedidoModel}from '../modelos/OrdendePedido';

@Injectable()
export class OrdenPedidosService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }

    getpedidos(){
        return this._http.get<any>(this.url+'/OrdenPedidos').shareReplay();
    }
    addOrdenPedido(orden:OrdenDePedidoModel):Observable<any>{
        let json = JSON.stringify(orden);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/OrdenPedidos',params,{headers:headers});
            
    }
    SeleccionarProducto(id){
        return this._http.get<any>(this.url+'/OrdenPedidos/'+id).shareReplay();
    }

    borrarproducto(id){
        return this._http.get<any>(this.url+'/OrdenPedidos/eliminar/'+id).shareReplay();
    }
    Productosupdate(id,orden:OrdenDePedidoModel):Observable<any>{
        let json = JSON.stringify(orden);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/OrdenPedidos/'+id,params,{headers:headers});
    }

    listProductos(){
        return this._http.get<any>(this.url+'/productos-get').shareReplay();
    }
    getfecha(){
        return this._http.get<any>(this.url+'/fecha').shareReplay();
    }
}