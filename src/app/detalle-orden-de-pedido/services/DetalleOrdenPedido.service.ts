import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/observable';
import {DetalleOrdenDePedidoModel}from '../modelos/DetalleOrdendePedido';

@Injectable()
export class DetalleOrdenPedidosService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }

    getdetalle(){
        return this._http.get<any>(this.url+'/OrdenPedidos').shareReplay();
    }
    adddetalleOrdenPedido(detalle:DetalleOrdenDePedidoModel):Observable<any>{
        let json = JSON.stringify(detalle);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/DetalleOrdenPedidos',params,{headers:headers});
            
    }
    seleccionardcetalle(id){
        return this._http.get<any>(this.url+'/OrdenPedidos/'+id).shareReplay();
    }

    borrardetalle(id){
        return this._http.get<any>(this.url+'/OrdenPedidos/eliminar/'+id).shareReplay();
    }
    detalleupdate(id,orden:DetalleOrdenDePedidoModel):Observable<any>{
        let json = JSON.stringify(orden);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/OrdenPedidos/'+id,params,{headers:headers});
    }

    detallelist(){
        return this._http.get<any>(this.url+'/productos-get').shareReplay();
    }
}