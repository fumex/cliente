import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class EmpresaService{
    
    constructor(
        private http:HttpClient
    ){}
    postFile(caption:string,fileToUpload:File){
        let formData:FormData= new FormData();
        formData.append('photo',fileToUpload,fileToUpload.name);
        formData.append('dni', caption);
        let headers=new HttpHeaders();
        headers.append('Content-Type','application/json');
        return this.http.post(`${environment.api_url}/empresa-add`,formData,{headers:headers});
    }
}