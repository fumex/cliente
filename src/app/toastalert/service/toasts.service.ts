import { ViewContainerRef } from '@angular/core';
import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Injectable()
export class ToastService{
    public url:string;
    constructor(
        public _http:HttpClient,
        public toastr: ToastsManager,
        vcr: ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
    }
     errorAlerta(text,titulo){
        this.toastr.error(text, titulo, {
            toastLife:3000,
        });
     }
     informacionAlerta(text,titulo){
        this.toastr.info(text, titulo, {
            toastLife:3000,
        });
     }
     SuccessAlert(text,titulo){
        this.toastr.success(text, titulo, {
            toastLife:3000,
        });
     }
     WarningAlert(text,titulo){
        this.toastr.warning(text, titulo, {
            toastLife:3000,
        });
     }
}