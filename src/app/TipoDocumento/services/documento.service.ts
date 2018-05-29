import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DocumentoModel } from '../models/documento';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class DocumentoService{
    
    constructor(
        private http:HttpClient
    ){}
    updateDocumento(id, documento:DocumentoModel):Observable<any>{
        let params=JSON.stringify(documento);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this.http.post(`${environment.api_url}/auth/documento-update/`+id,params,{headers:headers});
    }
    addDocumento(documento:DocumentoModel):Observable<any>{
        let params=JSON.stringify(documento);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this.http.post(`${environment.api_url}/auth/documento-add`,params,{headers:headers});
    }
    getDocumento(id):Observable<any>{
        return this.http.get<any>(`${environment.api_url}/auth/documento/`+id).shareReplay();
    }
    getDocumentos():Observable<any>{
        return this.http.get<any>(`${environment.api_url}/auth/documentos`).shareReplay();
    }
    getDocumPersona():Observable<any>{
        return this.http.get<any>(`${environment.api_url}/auth/documentos-persona`).shareReplay();
    }
    getDocumComprobante():Observable<any>{
        return this.http.get<any>(`${environment.api_url}/auth/documentos-comprobante`).shareReplay();
    }
    deleteDocumento(id):Observable<any>{
        return this.http.get(`${environment.api_url}/auth/documento-delete/`+id).shareReplay();
    }
}