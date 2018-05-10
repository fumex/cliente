import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ProveedorModel } from '../models/proveedor';
import { Http } from '@angular/http';
import { shareReplay } from 'rxjs/operators';

@Injectable()
export class ProveedorService{
    public url:string;
    
    constructor(
       private http:HttpClient
    ){}
    getTable():Observable<any[]>{
        return this.http.get<any>(`${environment.api_url}/auth/proveedores`).shareReplay();
    }

    addProveedor(proveedor:ProveedorModel):Observable<any>{
        let json=JSON.stringify(proveedor);
        let params="json="+json;
        let headers=new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this.http.post(`${environment.api_url}/auth/proveedores-add`,params,{headers:headers});
    }

    deleteProveedor(id):Observable<any>{
        return this.http.get(`${environment.api_url}/auth/proveedores-delete/`+id).shareReplay();
    }
  
}