import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/Observable';
import {DetalleVentasModel}from '../modelos/detalle_ventas';
import {inventario} from '../../inventario/modelos/inventario';
import {codigoProductosModel} from '../modelos/codigo_productos';

@Injectable()
export class DetalleVentasService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }
    guardardetalleventas(detalle:DetalleVentasModel):Observable<any>{
        let json = JSON.stringify(detalle);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/guardardetalleventa',params,{headers:headers});
    }
    guardarmoveinv(inventario:inventario):Observable<any>{
        let json = JSON.stringify(inventario);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/guardariym',params,{headers:headers});
    }
    getdetalleventas(id){
        return this._http.get<any>(this.url+'/getdetalleventas/'+id).shareReplay();
    }
    getdetalleventasporserie(id){
        return this._http.get<any>(this.url+'/getventaporserie/'+id).shareReplay();
    }
    editarcodigoproductos(cod:codigoProductosModel):Observable<any>{
        let json = JSON.stringify(cod);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/editarcodigo_producto',params,{headers:headers});
    }
}