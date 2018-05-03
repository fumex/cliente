import {Injectable} from'@angular/core';
import {Http,Response,Headers,RequestOptions}from '@angular/http';
import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/observable';
import {producto}from '../modelos/productos';

@Injectable()
export class ProductoService{
    public url:string;
    constructor(
        public _http:Http
    ){
     this.url=environment.api_url;   
    }

    getProductos(){
        return this._http.get(`${environment.api_url}/productos`).map(res=>res.json());
    }
}