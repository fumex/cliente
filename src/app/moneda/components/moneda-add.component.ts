import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { MonedaService } from '../services/moneda.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { MonedaModel } from '../models/moneda';
import { User } from '../../auth/interfaces/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ToastsManager } from 'ng2-toastr';

declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'moneda-add',
    templateUrl:'../views/moneda-add.html',
    providers:[MonedaService,ToastService]
})
export class MonedaAddComponent implements OnInit{

    public title;
    public moneda:MonedaModel;
    public monedas:MonedaModel[];
    public confirmado:boolean;
    public user:User;

    constructor(
        private monedaService:MonedaService,
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
        this.moneda= new MonedaModel(null,'',null,this.user.id);
        this.confirmado=true;
        this.tabla();
    }
    ngOnInit(){
        this.getMonedas();
    }
    onSubmit(){
        this.monedaService.addMoneda(this.moneda).subscribe(
            result=>{
                console.log(result);
                this.clearMoneda();
                this.destruir();
                this.alertaSave();
            },
            error=>{
                console.log(<any>error);
                let text="La Moneda existe";
                this.toaste.WarningAlert(text,'Error!');
                
            }
        );
    }
    onCancel(){
        this.clearMoneda();
    }
    clearMoneda(){
        this.moneda=new MonedaModel(null,'',null,this.user.id);
    }
    //---------------------------------------------------------------------
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#mone').DataTable({
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ]
                 });
            });
        },3000);
    }
    getMonedas(){
        this.monedaService.getMonedas().subscribe(
            result=>{
                this.monedas=result;
            },  
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        )
    }
    onDeleteDocumentos(id){
        this.monedaService.deleteMoneda(id).subscribe(
            result=>{
                this.getMonedas();
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        )
    }
    edit(id){
        this.router.navigate(['/'+this.user.rol+'/moneda/edit',id]);
        this.alertaUpdate();
    }
    alertaSave(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Guardado...',
            buttons: false,
            timer: 2000,
        })   
    }
    alertaUpdate(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Cargando...',
            buttons: false,
            timer: 2000,
        })   
    }
    alertaDelete(id){
        let identi=id;
        swal({
            title: "esta seguro",
            text: "despúes de borrar, no se pude recuperar",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.onDeleteDocumentos(identi);
                this.destruir();
                swal({
                    position: 'center',
                    icon: "error",
                    title: 'eliminado...',   
                    timer: 3000,
                    buttons: false,
                });
            } else {
              
            }
          });
    }

    destruir(){	
        var table = $('#mone').DataTable(); table .clear() ;
        $('#mone').DataTable().destroy();
        this.reconstruir();
    }
    reconstruir(){
        this.tabla();
        this.getMonedas();
    }
}