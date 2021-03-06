import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/Observable';
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
        let params = JSON.stringify(orden);
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'/OrdenPedidos',params,{headers:headers});
            
    }
    modificarpedido(id,orden:OrdenDePedidoModel):Observable<any>{
        let json = JSON.stringify(orden);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/OrdenPedidos/'+id,params,{headers:headers});
            
    }
    seleccionarpedido(id){
        return this._http.get<any>(this.url+'/OrdenPedidos/'+id).shareReplay();
    }

    borrarpedido(id){
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
    //------------------------Orden Pedido Local Storage---------------------------------
    setOrdenPedido(ordenPedido:OrdenDePedidoModel){
        if(ordenPedido){
            localStorage.setItem('orden',btoa(JSON.stringify(ordenPedido)));
            return true;
        }
        return false;
    }
    getOrdenPedido():OrdenDePedidoModel{
        return localStorage.getItem('orden')?JSON.parse(atob(localStorage.getItem('orden'))):null;
    }
    clear():void{
        localStorage.removeItem('orden');
    }
    //----------------------------Detalle------------------------------------------------------------
    getDetallePedido(id){
        return this._http.get<any>(this.url+'/detalleordenselect/'+id).shareReplay();
    }

    //-------------------------Numero de Codigo----------------------------------------------------
   /* getCodigo(){
        return this._http.get<any>(this.url+'/orden/code').shareReplay();
    }*/
    dataPedido(id){
        return this._http.get<any>(this.url+'/orden-list/'+id).shareReplay();
    }
}