import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EmpresaModel } from '../models/empresa';
import { Observable } from 'rxjs';

@Injectable()
export class EmpresaService{
    
    constructor(
        private http:HttpClient
    ){}
    addEmpresa(empresa:EmpresaModel):Observable<any>{
        let params=JSON.stringify(empresa);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this.http.post(`${environment.api_url}/empresa-add`,params,{headers:headers});
    }
    updateEmpresa(id, empresa:EmpresaModel):Observable<any>{
        let params=JSON.stringify(empresa);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this.http.post(`${environment.api_url}/empresa-update/`+id,params,{headers:headers});
    }
    getEmpresa(id):Observable<any>{
        return this.http.get<any>(`${environment.api_url}/empresa/`+id).shareReplay();
    }
    getEmpresas():Observable<any>{
        return this.http.get<any>(`${environment.api_url}/empresas`).shareReplay();
    }
    deleteEmpresa(id):Observable<any>{
        return this.http.get(`${environment.api_url}/empresa-delete/`+id).shareReplay();
    }
    postFile(caption:string,fileToUpload:File){
        let formData:FormData= new FormData();
        formData.append('photo',fileToUpload,fileToUpload.name);
        formData.append('ruc', caption);
        let headers=new HttpHeaders();
        headers.append('Content-Type','application/json');
        return this.http.post(`${environment.api_url}/imagen-up`,formData,{headers:headers});
    }
    postpfx(ruc:string,fileToUpload:File,clave_sol:string){
        let formData:FormData= new FormData();
        formData.append('arch',fileToUpload,fileToUpload.name);
        formData.append('ruc', ruc);
        formData.append('clave', clave_sol);
        let headers=new HttpHeaders();
        headers.append('Content-Type','application/json');
        return this.http.post(`${environment.api_url}/certificado-up`,formData,{headers:headers});
    }
    getImage(name):Observable<any>{
        return this.http.get(`${environment.api_url}/empresa-img/`+name).shareReplay();
    }
    dataEmpresa():Observable<any>{
        return this.http.get(`${environment.api_url}/empresa-data`).shareReplay();
    }
    getall():Observable<any>{
        return this.http.get(`${environment.api_url}/get-all/`+name).shareReplay();
    }
    getprovincia():Observable<any>{
        return this.http.get(`${environment.api_url}/get-provincias/`+name).shareReplay();
    }
    getdepartamento():Observable<any>{
        return this.http.get(`${environment.api_url}/get-departamentos/`+name).shareReplay();
    }
    revisarexistencias():Observable<any>{
        return this.http.get(`${environment.api_url}/verificarsiexisteempresa`).shareReplay() ;
        
    }
}