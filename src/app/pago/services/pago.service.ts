import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { ProveedorModel } from '../../proveedor/models/proveedor';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { PagoModel } from '../models/pago';
import { PagoDetalleModel } from '../models/pago-detalle';
import { UnidadModel } from '../models/unidad';

@Injectable()
export class PagoService{
    constructor(
        private http:HttpClient
    ){}
    
    getProveedor():Observable<ProveedorModel[]>{
        return this.http.get<any>(`${environment.api_url}/auth/proveedor-list`).shareReplay();
    }

    getCodigo():Observable<any>{
        return this.http.get<any>(`${environment.api_url}/auth/pagos-code`).shareReplay();
    }
    //---------------------------Pago---------------------------------------------------------
    addPago(pago:PagoModel):Observable<any>{
        let params=JSON.stringify(pago);  
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this.http.post(`${environment.api_url}/auth/pagos-add`,params,{headers:headers});
    }
    //--------------------------Pago Detalles--------------------------------------------------
    addPagoDetalle(detalle:PagoDetalleModel):Observable<any>{
        let params=JSON.stringify(detalle);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return  this.http.post<any>(`${environment.api_url}/auth/pago-detalle-add`,params,{headers:headers});
    }
    //-----------------------------Unidades--------------------------------------------------
    getUnidades():Observable<UnidadModel[]>{
        return this.http.get<any>(`${environment.api_url}/auth/unidades`).shareReplay();
    }
    addUnidad(unidad:UnidadModel):Observable<any>{
        let params=JSON.stringify(unidad);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return  this.http.post<any>(`${environment.api_url}/auth/unidad`,params,{headers:headers});
    }
}