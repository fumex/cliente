import { Component,ViewContainerRef } from "@angular/core";
import { UsuarioService } from "../../usuarios/services/usuarios.service";
import { UsuarioModel } from '../../usuarios/modelos/usuarios';
import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import { DettaleUsuarioService } from "../../usuarios/services/DetalleUsuario.service";
import { DetalleUsuarioModel } from '../../usuarios/modelos/DetalleUsuario';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/interfaces/user.model';
import {Router,ActivatedRoute,Params}from '@angular/router';
import { Http, Response } from '@angular/http';
import {ToastService} from '../../toastalert/service/toasts.service'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";

declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
    selector:'add-image',
    templateUrl:'../views/insertar.imagen.component.html',
    providers:[UsuarioService,DettaleUsuarioService,ToastService,]
})
export class ImagesComponent{
    public filesToUpload:File[];
    public text;
    public image:any;
    public url;
    public ruta;
    constructor(
        private _usuarioservice:UsuarioService,
        private authService:AuthService,
        private router:Router,
        public http:HttpClient

    ) { 
        this.url=environment.api_url; 
        this.filesToUpload=null;  
    }
    ngOnInit() {
 
        }
    mostarriname(fileInput: any){
        
        this.filesToUpload = fileInput.target.files;
        console.log(this.filesToUpload);
        let myReader: FileReader = new FileReader();
        myReader.onloadend = (loadEvent: any) => {
            console.log('video', myReader.result);

        };
    }
    isertarimagen(dni){
        if(this.filesToUpload==null){
            console.log('nohaynada');
        }else{
            this._usuarioservice.insertariamgen(this.filesToUpload,dni).subscribe(
                data => console.log(data),
                error => console.log(error),
                
                );  
        }
           
    }
    getimage(){
        this._usuarioservice.mostaraimagen('2.jpg').subscribe(
            res=>{
                this.image=btoa(res);
                console.log(btoa(res));
                
            },
            error=>{
                console.log(error);
            }
        );
    }
}