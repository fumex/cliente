import { Component, OnInit } from '@angular/core';
import { EmisorService } from '../services/emisor.service';
import { EmpresaService } from '../../empresa/services/empresa.service';
import { EmpresaModel } from '../../empresa/models/empresa';

@Component({
    selector:'emisor-add',
    templateUrl:'../views/emisor-add.html',
    providers:[EmisorService]
})
export class EmisorAddComponent implements OnInit{
    
    public title:string;
    public empresa:EmpresaModel;
    public razonSocial:string;
    public ruc:string;

    constructor(
        private empresaService:EmpresaService
    ){
        this.title='Datos del Emisor'
    }
    ngOnInit(){
        this.getEmpresa();
    }
    getEmpresa(){
        this.empresaService.dataEmpresa().subscribe(
            result=>{
                console.log(result);
                this.empresa=result;
                this.asignarEmpresa(this.empresa);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    
    asignarEmpresa(empresa:EmpresaModel){
        this.razonSocial=empresa.nombre;
        this.ruc=empresa.ruc;
    }
}