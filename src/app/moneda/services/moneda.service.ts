import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MonedaModel } from '../models/moneda';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class MonedaService{
    constructor(
        private http:HttpClient
    ){}
    updateMoneda(id, moneda:MonedaModel):Observable<any>{
        let params=JSON.stringify(moneda);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this.http.post(`${environment.api_url}/moneda-update/`+id,params,{headers:headers});
    }
    addMoneda(moneda:MonedaModel):Observable<any>{
        let params=JSON.stringify(moneda);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this.http.post(`${environment.api_url}/moneda-add`,params,{headers:headers});
    }
    getMoneda(id):Observable<any>{
        return this.http.get<any>(`${environment.api_url}/moneda/`+id).shareReplay();
    }
    getMonedas():Observable<any>{
        return this.http.get<any>(`${environment.api_url}/monedas`).shareReplay();
    }
    deleteMoneda(id):Observable<any>{
        return this.http.get(`${environment.api_url}/moneda-delete/`+id).shareReplay();
    }
}