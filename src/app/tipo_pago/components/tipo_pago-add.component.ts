import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TipoPagoService } from '../services/tipo_pago.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { TipoPagoModel } from '../models/tipo_pago';
import { User } from '../../auth/interfaces/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
    selector:'tipoPago-add',
    templateUrl:'../views/tipo_pago-add.html',
    providers:[TipoPagoService,ToastService]
})
export class TipoPagoAddComponent implements OnInit{
    public title;
    public tipo_pago:TipoPagoModel;
    public tipo_pagos:TipoPagoModel[];
    public confirmado:boolean;
    public user:User;
    constructor(
        private tipoPagoService:TipoPagoService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef 
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.title='Moneda';
        this.user=this.auth.getUser();
        this.tipo_pago= new TipoPagoModel(null,'','','',this.user.id);
        this.confirmado=true;
        this.tabla();
    }
    ngOnInit(){
        this.getTipoPago();
    }
}