import { Component,ViewContainerRef } from "@angular/core";
import { UnidadesModel } from "../modelos/unidades";
import { UnidadService } from '../services/unidad.service';
import { User } from "../../auth/interfaces/user.model";
import { AuthService } from "../../auth/services/auth.service";

import {ToastService} from '../../toastalert/service/toasts.service'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
    selector:'unidades',
    templateUrl:'../views/unidad.component.html',
    providers:[UnidadService,ToastService]
})
export class unidadcomponent{
    public unidades:UnidadesModel;
    public unidadestab:Array<UnidadesModel>=[];
    public unidadobtenida:UnidadesModel;
    public titulo;
    public user:User;
    public verbotiniciales=null;
    public nombre;
    public title="Unidades";
    constructor(
        private _UnidadService:UnidadService,
        private auth:AuthService,
        private toaste:ToastService,
        public toastr: ToastsManager,
        vcr: ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.user=this.auth.getUser();
        this.unidades = new UnidadesModel(null,'','',this.user.id,null);
        this.unidadobtenida = new UnidadesModel(null,'','',this.user.id,null);
        this.titulo="agregar unidad";
    }
    ngOnInit(){
        this.getunidades();
        this.tablaunidades();
    }
    quitarfilas(){
        $(document).ready(function() {
            var table = $('#example').DataTable();
         
            $('#example tbody').on( 'click', 'tr', function () {
                if ( $(this).hasClass('selected') ) {
                    $(this).removeClass('selected');
                }
                else {
                    table.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            } );
         
            $('#button').click( function () {
                table.row('.selected').remove().draw( false );
            } );
        } );
    }
    borrarfilas(){
        $(document).ready(function() {
            var table = $('#tablaunidades').DataTable();
                table.rows().remove().draw( false );
        } );
    }
    limpiar(){
        this.unidades=new UnidadesModel(null,null,null,null,null);
    }
    agregarfilas(){
        let i=0;
        while(i<this.unidadestab.length){
            console.log(this.unidadestab[i].unidad)
            $(document).ready(function() {
                var t = $('#tablaunidades').DataTable();
                    t.row.add( [
                        "asas",
                       "as",
                        "this.unidadestab[0].abreviacion",
                        "<div *ngIf='verbotiniciales!=uni.id'>"+
                        "<button  type='button' (click)='editarunidad(uni.id)' class='btn btn-info  btn-flat btn-addon btn-xs m-b-10'>"+
                            "<i class='fa fa-edit'></i></button>"+
                        "<button  type='button' (click)='alertaDelete(documento.id)' class='btn btn-danger btn-flat btn-addon btn-xs m-b-10'>"+
                            "<i class='fa fa-trash-o'></i></button>"+
                        "</div>"+
                        "<div *ngIf='verbotiniciales==uni.id'>"+
                        "<button  type='button' (click)='actualizarunidad(uni)' class='btn btn-info  btn-flat btn-addon btn-xs m-b-10'>"+
                            "<i class='fa fa-save'></i></button>"+
                        "<button  type='button' (click)='cancelar()' class='btn btn-danger btn-flat btn-addon btn-xs m-b-10'>"+
                            "<i class='fa fa-ban'></i></button>"+
                    "</div>",
                    ] ).draw( false );
            } );

            i++;
        }
        
    }
    getunidades(){
        this._UnidadService.getunidad().subscribe(
            res=>{
                this.unidadestab=res;
                console.log(res);
            },
            err=>{
                console.log(<any>err)
            }
        );
    }
    getunidad(id){
        this._UnidadService.selectunidad(id).subscribe(
            res=>{
                this.unidadobtenida=res;
                console.log(res);
            },
            err=>{
                console.log(<any>err)
            }
        );
    }
    editarunidad(id){
        this.verbotiniciales=id;
        this.getunidad(id);
        //this.actualizarunidad(arreglo.id);
    }
    cancelar(){
        this.verbotiniciales=null;
        this.unidadobtenida = new UnidadesModel(null,'','',this.user.id,null);
    }
    actualizarunidad(arreglo){
        this._UnidadService.updateunidad(arreglo.id,this.unidadobtenida).subscribe(
            res=>{
                if(res.code==200){
                    this.modificaralerta();
                    this.cancelar();
                    this.destruirttablaunidades();
                    this.recontruirtablaunidades();
                    this.modificaralerta();
                }
                console.log(res);
            },
            err=>{
                console.log(<any>err)
            }
        );
    }
    exit(){
    }

    guardarunidad(){
        this.nombre =document.getElementById('unidadess');
        //this.categoria = new categoria(tipo1);
        console.log(this.unidades);
        this._UnidadService.addunidad(this.unidades).subscribe(
            response=>{
                console.log(response);
                if(response.code==300){
                    let text="esa abreviacion ya existe ("+response.seleccionado +")";
                    this.toaste.errorAlerta(text,'Error!');
                    this.unidades.unidad=null;
                    this.unidades.abreviacion=null;
                }else{
                    this.unidades = new UnidadesModel(null,'','',this.user.id,null);
                    //this.alertaecho();
                    this.destruirttablaunidades();
                    this.recontruirtablaunidades();
                    this.alertaecho();
                    this.exit();
                }
                
            },
            error=>{
                console.log(<any>error);
                //this.alertaerror();
                if(error.status==500){
                    let text="la unidad ya existe";
                    this.toaste.errorAlerta(text,'Error!');
                    this.nombre.focus();
                    this.nombre.select();
                }
            }
        );
    }
    alertaDelete(id){
        swal({
            title: "esta seguro de eliminar esta unidad",
            text: "se eliminaran los cambios relacionados con la unidad",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                this._UnidadService.eliminar(id).subscribe(
                    res=>{
                        console.log(res)
                        this.destruirttablaunidades();
                        this.recontruirtablaunidades();
                    },
                    err=>{
                        console.log(<any>err)
                    }
                );
            }
        });
    }
    tablaunidades(){
        //this.mostrar();
       
        setTimeout(function(){
            $(function(){
                 $('#tablaunidades').DataTable({
                    "paging":   false,
                    "ordering": false,
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ]
                 });
            });
        },3000);
    }
    destruirttablaunidades(){	
        var table = $('#tablaunidades').DataTable();
        table .clear() ;
        $('#tablaunidades').DataTable().destroy();
    }
    recontruirtablaunidades(){
        this.tablaunidades();
        this.getunidades();
        
    }
    modificaralerta(){
        swal({
            position: 'center',
            icon: "success",
            title: 'se guardo la undiad',
            buttons: false,
            timer: 3000
          })
    }
    alertaerror(){
        swal({
            position: 'center',
            icon: "warning",
            title: 'ocurio un error ',
            text:'intentelo de nuevo mas tarde',
            buttons: true,
            timer: 3000
          })
    }
    alertaecho(){
        swal({
            position: 'center',
            icon: "success",
            title: 'Insertado',
            text:'La Unidad se agrego correctamente',
            buttons: true,
            timer: 1500
          })
    }
}