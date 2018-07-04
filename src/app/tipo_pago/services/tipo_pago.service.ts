import { Injectable } from '@angular/core';
import { TipoPagoModel } from '../models/tipo_pago';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class TipoPagoService{
    constructor(
        private http:HttpClient
    ){}
    updateTipoPago(id, tipo_pago:TipoPagoModel):Observable<any>{
        let params=JSON.stringify(tipo_pago);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this.http.post(`${environment.api_url}/moneda-update/`+id,params,{headers:headers});
    }
    addTipoPago(tipo_pago:TipoPagoModel):Observable<any>{
        let params=JSON.stringify(tipo_pago);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this.http.post(`${environment.api_url}/tipo_pago-add`,params,{headers:headers});
    }
    getTipoPago(id):Observable<any>{
        return this.http.get<any>(`${environment.api_url}/tipo_pago/`+id).shareReplay();
    }
    getTipoPagos():Observable<any>{
        return this.http.get<any>(`${environment.api_url}/tipo_pagos`).shareReplay();
    }
    deleteTipoPago(id):Observable<any>{
        return this.http.get(`${environment.api_url}/tipo_pago-delete/`+id).shareReplay();
    }
}