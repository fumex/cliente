import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ImpuestoModel } from '../models/impuesto';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ImpuestoService{
    constructor(
        private http:HttpClient
    ){}
    updateImpuesto(id, impuesto:ImpuestoModel):Observable<any>{
        let params=JSON.stringify(impuesto);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this.http.post(`${environment.api_url}/impuesto-update/`+id,params,{headers:headers});
    }
    addImpuesto(impuesto:ImpuestoModel):Observable<any>{
        let params=JSON.stringify(impuesto);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this.http.post(`${environment.api_url}/impuesto-add`,params,{headers:headers});
    }
    getImpuesto(id):Observable<any>{
        return this.http.get<any>(`${environment.api_url}/impuesto/`+id).shareReplay();
    }
    getImpuestos():Observable<any>{
        return this.http.get<any>(`${environment.api_url}/impuestos`).shareReplay();
    }
    deleteImpuesto(id):Observable<any>{
        return this.http.get(`${environment.api_url}/impuesto-delete/`+id).shareReplay();
    }


    getigv():Observable<any[]>{
        return this.http.get<any>(`${environment.api_url}/igv`).shareReplay();
    }
    getotro():Observable<any>{
        return this.http.get<any>(`${environment.api_url}/otro`).shareReplay();
    }
}