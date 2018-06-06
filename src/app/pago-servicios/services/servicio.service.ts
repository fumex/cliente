import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { ServicioAddModel } from '../models/servicio-add';
@Injectable()
export class ServicioPagoService{
    constructor(
        private http:HttpClient
    ){}

    //---------------------------------Lista de Servicio----------------------------
    getServicio():Observable<any[]>{
        return this.http.get<any>(`${environment.api_url}/auth/servicio-list`).shareReplay();
    }
    //---------------------------------Lista de Documentoss------------------------------
    getDocumento():Observable<any[]>{
        return this.http.get<any>(`${environment.api_url}/auth/documentos-comprobante`).shareReplay();
    }
    getCode():Observable<any>{
        return this.http.get<any>(`${environment.api_url}/auth/servicio-code`).shareReplay();
    }
    //-------------------------------Guardar Servicios----------------------------------
    addServicio(servicio:ServicioAddModel):Observable<any>{
        let params=JSON.stringify(servicio);
        let headers= new HttpHeaders().set('Content-Type','application/json');
        return this.http.post<any>(`${environment.api_url}/auth/servicio-add`,params,{headers:headers});
    }
    /****************************Anular********************/
    listServicios():Observable<any[]>{
        return this.http.get<any>(`${environment.api_url}/auth/servicios-get`).shareReplay();
    }
    deleteServicio(id:number):Observable<any>{
        return this.http.get<any>(`${environment.api_url}/auth/servicio-delete/`+id).shareReplay();
    }
}
