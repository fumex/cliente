import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ImpuestoService } from '../services/impuesto.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ToastsManager } from 'ng2-toastr';
import { User } from '../../auth/interfaces/user.model';
import { ImpuestoModel } from '../models/impuesto';

declare var jQuery:any;
declare var $:any;
declare var swal:any;
@Component({
    selector:'impuesto-add',
    templateUrl:'../views/impuesto-add.html',
    providers:[ImpuestoService,ToastService]
})
export class ImpuestoAddComponent implements OnInit{
    public title;
    public impuesto:ImpuestoModel;
    public impuestos:ImpuestoModel[];
    public confirmado:boolean;
    public user:User;
    constructor(
        private impuestoService:ImpuestoService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.title='Impuesto';
        this.user=this.auth.getUser();
        this.impuesto= new ImpuestoModel(null,'',null,'','',this.user.id);
        this.confirmado=true;
        this.tabla();
    }
    ngOnInit(){
        this.getImpuestos();
    }
    onSubmit(){
        this.impuestoService.addImpuesto(this.impuesto).subscribe(
            result=>{
                console.log(result);
                this.clearImpuesto();
                this.destruir();
                this.alertaSave();
            },
            error=>{
                console.log(<any>error);
                let text="El Impuesto existe";
                this.toaste.WarningAlert(text,'Error!');
                
            }
        );
    }
    onCancel(){
        this.clearImpuesto();
    }
    clearImpuesto(){
        this.impuesto=new ImpuestoModel(null,'',null,'','',this.user.id);
    }
    //---------------------------------------------------------------------
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#impu').DataTable({
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ]
                 });
            });
        },3000);
    }
    getImpuestos(){
        this.impuestoService.getImpuestos().subscribe(
            result=>{
                this.impuestos=result;
            },  
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        )
    }
    onDeleteImpuesto(id){
        this.impuestoService.deleteImpuesto(id).subscribe(
            result=>{
                this.getImpuestos();
            },
            error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
            }
        )
    }
    edit(id){
        this.router.navigate(['/'+this.user.rol+'/impuesto/edit',id]);
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
                this.onDeleteImpuesto(identi);
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
        var table = $('#impu').DataTable(); table .clear() ;
        $('#impu').DataTable().destroy();
        this.reconstruir();
    }
    reconstruir(){
        this.tabla();
        this.getImpuestos();
    }
}