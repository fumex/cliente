import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/Observable';
import {NotaDevitoModel}from '../models/nota_devito';
import {DetalleNotaDevitoModel}from '../models/detalle_nota_devito';

@Injectable()
export class NotaDebitoService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }
    getserieanular(id):Observable<any>{
        return this._http.get<any>(this.url+'/generarserien_debito/'+id).shareReplay();
    }
    guardarnotas(nota_debito:NotaDevitoModel):Observable<any>{
        let json = JSON.stringify(nota_debito);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/guardarnotadebito',params,{headers:headers});
    }
}