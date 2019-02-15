import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { codproMdel} from '../models/codigo_productos'
@Injectable()
export class CodigoProductoService{
    public url:string;
    constructor(
        private http:HttpClient,
        public _http:HttpClient
    ){
        this.url=environment.api_url;   
    }
    
    getUnidades():Observable<codproMdel[]>{
        return this.http.get<any>(`${environment.api_url}/auth/unidades`).shareReplay();
    }
    
    guardarcodigosproducto_vendible(codigos:codproMdel):Observable<any>{
        let json=JSON.stringify(codigos);
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/insertar_codigo_productos_vendible',params,{headers:headers});
    }
    
}