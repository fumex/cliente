import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/Observable';
import {AnularModel}from '../modelos/anular';

@Injectable()
export class AnularService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }
    getserieanular(id):Observable<any>{
        return this._http.get<any>(this.url+'/generarserienota/'+id).shareReplay();
    }
}