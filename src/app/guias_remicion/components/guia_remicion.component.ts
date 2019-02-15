import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastService } from '../../toastalert/service/toasts.service';
import { User } from '../../auth/interfaces/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ToastsManager } from 'ng2-toastr';

declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'guia-remicion ',
    templateUrl:'../views/guiaremicion.html',
    providers:[ToastService]
})
export class EntidadFinancieraComponent implements OnInit{
    public title;
    public user:User;
    public veredit=null;
    constructor(
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef 
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.title='Entidad Financiera';
        this.user=this.auth.getUser();
    }
    ngOnInit(){
    }
}