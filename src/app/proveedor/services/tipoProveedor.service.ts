import { Injectable } from '@angular/core';

import { TipoProveedorModel } from '../models/tipoProveedor';
import {Observable} from 'rxjs/Observable'
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class TipoProveedorService{
    constructor(
        private http:HttpClient
    ){}

    getTipo():Observable<TipoProveedorModel[]>{
        return this.http.get<any>(`${environment.api_url}/auth/tipo`).shareReplay();
    }

    addTipo(tipo:TipoProveedorModel):Observable<any>{
        let params=JSON.stringify(tipo);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this.http.post(`${environment.api_url}/auth/tipo-add`,params,{headers:headers});
    }
}