import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { ClienteModel } from '../models/cliente';

@Injectable()
export class ClienteService{
    public url:string;
    constructor(
        private http:HttpClient
    ){
        this.url=`${environment.api_url}/`;
    }
    getClientes():Observable<any>{
        return this.http.get<any>(this.url+'clientes').shareReplay();
    }
    getCliente(id):Observable<any>{
        return this.http.get<any>(this.url+'cliente/'+id).shareReplay();
    }
    addCliente(cliente:ClienteModel):Observable<any>{
        let params=JSON.stringify(cliente);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this.http.post(`${environment.api_url}/cliente-add`,params,{headers:headers});
    }
    updateCliente(id,cliente:ClienteModel):Observable<any>{
        let params=JSON.stringify(cliente);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this.http.post(this.url+'cliente-update/'+id,params,{headers:headers});
    }
    deleteCliente(id):Observable<any>{
        return this.http.get(this.url+'cliente-delete/'+id).shareReplay();
    }

    //---------------Prueba
    sendFile(formData:FormData){
        //let params=JSON.stringify(formData);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this.http.post(this.url+'empresa-add',formData,{headers:headers});
    }
}