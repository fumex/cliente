import { Component } from "@angular/core";
import { UsuarioService } from "../../usuarios/services/usuarios.service";
import { UsuarioModel } from '../../usuarios/modelos/usuarios';
import {SucursalModel} from '../../sucursales/modelos/sucursal';
import {SucursalService}from '../../sucursales/services/sucursal.service';
import { DettaleUsuarioService } from "../../usuarios/services/DetalleUsuario.service";
import { DetalleUsuarioModel } from '../../usuarios/modelos/DetalleUsuario';
import { AuthService } from '../../auth/services/auth.service';
import {DocumentoModel} from '../../TipoDocumento/models/documento';
import {DocumentoService}from '../../TipoDocumento/services/documento.service';
import { User } from '../../auth/interfaces/user.model';
import { environment } from "../../../environments/environment";

declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
    selector:'add-usuario',
    templateUrl:'../views/usuarios.component.html',
    providers:[UsuarioService,SucursalService,DettaleUsuarioService,AuthService]
})
export class EditarUsuarioPersonal{
    public usuario:UsuarioModel;
    public sucursales:Array<SucursalModel>=[];
    public DetalleUsuario:Array<DetalleUsuarioModel>=[];
    public detalleusu:DetalleUsuarioModel;
    public documentos:DocumentoModel;
    public titulo;
    public compara;
    public cuenta;
    public idusuario;
    public ap;
    public id;
    public id2;
    public count;
    public siguiente;
    public usuarios:UsuarioModel;
    public filesToUpload:File[];
    public text;
    public image:any;
    public url;
    public ruta;
    public filear;
    public res:any;
    imageUrl: string = "assets/images/1.png";
    fileToUpload:File = null;
    public encabezados:Array<any>=[];
    constructor(
        private _UsuarioService:UsuarioService,
        private _SucursalService:SucursalService,
        private _DettaleUsuarioService:DettaleUsuarioService,
        private _DocumentoService:DocumentoService,
    ){

        this.usuario = new UsuarioModel(null,'','',null,null,'',null,'','1994-01-01','','','','',null);
        this.detalleusu=new DetalleUsuarioModel(null,0,0,null);

        //this.documentos=new DocumentoModel(null,null,null);
        this.titulo="Mantenimiento de Usuarios"
        this.compara=0;
        this.cuenta=1;
        this.ap=1;
        this.siguiente=0;
        this.id=0;
        this.id2=0;
        this.count=0;
        this.idusuario=0
        this.url=environment.api_url; 
        this.filesToUpload=null;  
        this.image=this.url+'/imagenes/2.png';
    }
    ngOnInit(){
        this.mostrarsucursal();
        this.mostradocuemnto();
        this.mostrarusuarios();
        this.encabezados.push({nombre:"Inicio",abrir:false,estado:false,componentes:[]})
        this.encabezados[0].componentes.push({nombre:"Reportes de Inicio",estado:false,url:this.url,tipo_permiso:'reporte'});
        this.encabezados.push({nombre:"Proveedor",abrir:false,estado:false,componentes:[]})
        this.encabezados[1].componentes.push({nombre:"Agregar proveedor",estado:false,url:this.url+"Proveedor",tipo_permiso:'insercion'});
        this.encabezados[1].componentes.push({nombre:"Modificar proveedor",estado:false,url:this.url+"Proveedor",tipo_permiso:'edicion'});
        this.encabezados[1].componentes.push({nombre:"Eliminar proveedor",estado:false,url:this.url+"Proveedor",tipo_permiso:'anulacion'});
        this.encabezados.push({nombre:"Compras",abrir:false,estado:false,componentes:[]})
        this.encabezados[2].componentes.push({nombre:"Agregar compra",estado:false,url:this.url+"transaccion",tipo_permiso:'insercion'});
        this.encabezados[2].componentes.push({nombre:"Lista de compras",estado:false,url:this.url+"transaccion/list",tipo_permiso:'reporte'});
        this.encabezados[2].componentes.push({nombre:"Anular compra",estado:false,url:this.url+"transaccion/anular",tipo_permiso:'anulacion'});
        this.encabezados[2].componentes.push({nombre:"Imprimir/exportar(pdf) compra",estado:false,url:this.url+"transaccion/recibo",tipo_permiso:'imprecion'});
        this.encabezados.push({nombre:"Servicios",abrir:false,estado:false,componentes:[]})
        this.encabezados[3].componentes.push({nombre:"Agregar servicio",estado:false,url:this.url+"servicio",tipo_permiso:'insercion'});
        this.encabezados[3].componentes.push({nombre:"Anular servicio",estado:false,url:this.url+"servicio/anular",tipo_permiso:'anulacion'});
        this.encabezados[3].componentes.push({nombre:"Lista de Servicios",estado:false,url:this.url+"servicio/list",tipo_permiso:'reporte'});
        this.encabezados.push({nombre:"Cliente",abrir:false,estado:false,componentes:[]})
        this.encabezados[4].componentes.push({nombre:"Agregar cliente",estado:false,url:this.url+"cliente",tipo_permiso:'insercion'});
        this.encabezados[4].componentes.push({nombre:"Modificar cliente",estado:false,url:this.url+"cliente/edit/:id",tipo_permiso:'edicion'});
        this.encabezados[4].componentes.push({nombre:"Eliminar cliente",estado:false,url:this.url+"cliente",tipo_permiso:'anulacion'});
        this.encabezados.push({nombre:"Empresa",abrir:false,estado:false,componentes:[]})
        this.encabezados[5].componentes.push({nombre:"Modificar Empresa",estado:false,url:this.url+"empresa/edit",tipo_permiso:'edicion'});
        this.encabezados.push({nombre:"Productos",abrir:false,estado:false,componentes:[]})
        this.encabezados[6].componentes.push({nombre:"Agregar productos",estado:false,url:this.url+"productos",tipo_permiso:'insercion'});
        this.encabezados[6].componentes.push({nombre:"Modificar productos",estado:false,url:this.url+"productos",tipo_permiso:'edicion'});
        this.encabezados[6].componentes.push({nombre:"Eliminar productos",estado:false,url:this.url+"productos",tipo_permiso:'anulacion'});
        this.encabezados.push({nombre:"Almacenes",abrir:false,estado:false,componentes:[]})
        this.encabezados[7].componentes.push({nombre:"Agregar almacen",estado:false,url:this.url+"almacenes",tipo_permiso:'insercion'});
        this.encabezados[7].componentes.push({nombre:"Modificar almacen",estado:false,url:this.url+"almacenes",tipo_permiso:'edicion'});
        this.encabezados[7].componentes.push({nombre:"Eliminar almacen",estado:false,url:this.url+"almacenes",tipo_permiso:'anulacion'});
        this.encabezados.push({nombre:"Precios de productos",abrir:false,estado:false,componentes:[]})
        this.encabezados[8].componentes.push({nombre:"modificar precios",estado:false,url:this.url+"almacen",tipo_permiso:'edicion'}); 
        //this.encabezados[8].componentes.push({nombre:"ver codigo productos",estado:false,url:this.url+"almacen",tipo_permiso:'reporte'});
        this.encabezados.push({nombre:"Orden de pedido",abrir:false,estado:false,componentes:[]})
        this.encabezados[9].componentes.push({nombre:"Agregar orden de pedido",estado:false,url:this.url+"pedido",tipo_permiso:'insercion'});
        this.encabezados[9].componentes.push({nombre:"lista de pedidos",estado:false,url:this.url+"pedido/listar",tipo_permiso:'reporte'});
        this.encabezados[9].componentes.push({nombre:"Imprimir/exportar(pdf) pedido",estado:false,url:this.url+"pedido/recibo",tipo_permiso:'imprecion'});
        this.encabezados.push({nombre:"Inventario",abrir:false,estado:false,componentes:[]})
        this.encabezados[10].componentes.push({nombre:"Modificar inventario",estado:false,url:this.url+"inventario",tipo_permiso:'edicion'});
        this.encabezados[10].componentes.push({nombre:"reportes de inventario",estado:false,url:this.url+"reporteInventario",tipo_permiso:'insercion'});
        this.encabezados.push({nombre:"Usuarios",abrir:false,estado:false,componentes:[]})
        this.encabezados[11].componentes.push({nombre:"Agregar usuario",estado:false,url:this.url+"usuarios",tipo_permiso:'insercion'});
        this.encabezados[11].componentes.push({nombre:"Modificar usuario(datos generales)",estado:false,url:this.url+"editarusuario",tipo_permiso:'insercion'});
        this.encabezados[11].componentes.push({nombre:"Eliminar usuario",estado:false,url:this.url+"editarusuario",tipo_permiso:'anulacion'});
        this.encabezados.push({nombre:"Cajas",abrir:false,estado:false,componentes:[]})
        this.encabezados[12].componentes.push({nombre:"Agregar caja",estado:false,url:this.url+"cajas",tipo_permiso:'insercion'});
        this.encabezados[12].componentes.push({nombre:"Modificar caja",estado:false,url:this.url+"cajas",tipo_permiso:'edicion'});
        this.encabezados[12].componentes.push({nombre:"Eliminar caja",estado:false,url:this.url+"cajas",tipo_permiso:'anulacion'});
        this.encabezados.push({nombre:"Ventas",abrir:false,estado:false,componentes:[]})
        this.encabezados[13].componentes.push({nombre:"Ventas Gratuitas",estado:false,url:this.url+"ventas",tipo_permiso:'venta_gratis'});
        this.encabezados[13].componentes.push({nombre:"Agregar descuento",estado:false,url:this.url+"ventas",tipo_permiso:'descuento_producto'});
        this.encabezados[13].componentes.push({nombre:"Agregar Descuento global",estado:false,url:this.url+"ventas",tipo_permiso:'descuento_producto'});
        console.log(this.DetalleUsuario.length);  
    }

    confirmaractualizar(id){
        this.idusuario=id;
        this.cuenta=0;
        this.ap=0;
        this.mostraruduario(id);
        this.mostrardetalleusuario(id); 
        
    }
    borrar(id){
        this._UsuarioService.deshabilitarusuario(id).subscribe(
            response=>{
                console.log(response);
                this.destruirtablaus();
                this.recontablaus();
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
   
    atras(){
        this.cuenta=0;
        this.ap=0;
        this.id=0;
        
    }
    volvertablausuarios(){
        this.limpiar();
        console.log(this.sucursales);
        console.log(this.DetalleUsuario); 
        this.cuenta=1;
        this.ap=1;
        this.destruirtablaus();
        this.recontablaus();

    }
    alimentarareglodp(){
        this.ap=1;
        this.destruirtablasuc();
        this.reconsttablasuc();
        
    }
    mostraruduario(id){
        this._UsuarioService.getusuario(id).subscribe(
            response=>{
                
                this.usuario=response;
                console.log(response)
                this.image=this.url+'/imagenes/'+this.usuario.imagen;
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    mostrarusuarios(){
        this._UsuarioService.usuarios().subscribe(
            response=>{
                this.usuarios=response;
                this.tablausuarios();
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    mostrardetalleusuario(id){
        this._DettaleUsuarioService.seleccionardetalleusuario(id).subscribe(
            respuesta=>{
                this.detalleusu=respuesta;
                console.log(this.id);
                while(this.id<respuesta.length){
                    
                    
                    if(respuesta[this.id].permiso===true){
                        
                        
                        while(this.id2 < this.sucursales.length){
                            

                            if(this.detalleusu[this.id].id_sucursal==this.sucursales[this.id2].id){
                                this.sucursales[this.id2].id=null;
                                this.detalleusu[this.id].id=this.id2;
                                this.DetalleUsuario.push(this.detalleusu[this.id]);  
                            }
                            this.id2=this.id2+1;
                        }
                        this.siguiente=this.siguiente+1;
                                              
                        this.id2=0;
                    }
                    
                    this.id=this.id+1;
                }
                console.log(this.sucursales);
                console.log(this.DetalleUsuario);
            },
            error=>{
                console.log(<any>error);
            }
        );
        this.id=0;
        
    }
    mostradocuemnto(){
        this._DocumentoService.getDocumPersona().subscribe(
            response=>{
                
                this.documentos=response;
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    addsucursal(index,id){
        console.log(this.sucursales);
        console.log(this.DetalleUsuario);   
        this.detalleusu=new DetalleUsuarioModel(null,0,this.idusuario,null);
        this.siguiente=this.siguiente+1;
        this.id=0;
        this.sucursales[index].id=null;
        while(this.id<this.DetalleUsuario.length){
            if(this.DetalleUsuario[this.id].id===index){
                this.DetalleUsuario[this.id].permiso=true;
                this.count=this.count+1;
            }
            this.id=this.id+1;
        }
        if(this.count===0){
            this.detalleusu.id=index;
            this.detalleusu.id_sucursal=id;
            this.detalleusu.permiso=true;
            this.DetalleUsuario.push(this.detalleusu);
            this.detalleusu=new DetalleUsuarioModel(null,0,this.idusuario,null);

            console.log("entro")
        }
        this.count=0;
        this.id=0;
        console.log(this.DetalleUsuario);
    }

    quitarsucursal(index){

        this.id=0;
        this.siguiente=this.siguiente-1;
        while(this.id<this.DetalleUsuario.length){
            if(this.DetalleUsuario[this.id].id===index)
            {
                this.sucursales[index].id=this.DetalleUsuario[this.id].id_sucursal;
                this.DetalleUsuario[this.id].permiso=false;
                //this.DetalleUsuario.splice(this.id,1);
            }
            this.id=this.id+1;
        }
        this.id=0;
        console.log(this.sucursales);
        console.log(this.DetalleUsuario); 
    }
   
    mostrarsucursal(){
        this._SucursalService.getsucursal().subscribe(
            response=>{
                this.sucursales=response;
            },
            error=>{
                console.log(<any>error);
            }
        );

    }
    limpiar(){
        this.cuenta=0;
        this.id=0;
        this.id2=0;
        this.usuario = new UsuarioModel(null,'','',null,null,'',null,'','','','','','',null);
        this.detalleusu=new DetalleUsuarioModel(null,0,this.idusuario,null);
        let numero=this.DetalleUsuario.length;
        while(this.id<numero){
            while(this.id2<this.sucursales.length){
                if(this.DetalleUsuario[this.id].id===this.id2)
                {
                    this.sucursales[this.id2].id=this.DetalleUsuario[this.id].id_sucursal;
                }
                this.id2=this.id2+1;
            }
            this.id2=0;
            this.id=this.id+1;
            console.log(this.id2)
        } 
        this.id=0;      
        while(this.id<numero){
            this.DetalleUsuario.splice(0,1);

            this.id=this.id+1;
        }
        this.id=0;
       
     }
     guardarcambios(){
         this.id=0;
         this._UsuarioService.updateusuario(this.idusuario,this.usuario).subscribe(
            response=>{

                console.log(response);

            },
            error=>{
                console.log(<any>error);
            }
         );
         while(this.id<this.DetalleUsuario.length){
             this._DettaleUsuarioService.updatedetalleusuario(this.DetalleUsuario[this.id]).subscribe(
                response=>{
                    console.log(response);
    
                },
                error=>{
                    console.log(<any>error);
                }
            );
            this.id=this.id+1;
         }
         this.id=0;
         this.volvertablausuarios();
         this.actualizaralerta();
     }
     tablausuarios(){
        setTimeout(function(){
            $(function(){
                 $('#tablausuarios').DataTable();
            });
        },2500);
    }
    tablasucursales(){
        setTimeout(function(){
            $(function(){
                 $('#tablasucursales').DataTable();
            });
        },500);
    }
    destruirtablaus(){
        var table = $('#tablausuarios').DataTable(); table .clear() ;
        $('#tablausuarios').DataTable().destroy();
    }
    recontablaus(){
        this.tablausuarios()
        this.mostrarusuarios();
    }
    destruirtablasuc(){
        var table = $('#tablasucursales').DataTable(); table .clear() ;
        $('#tablasucursales').DataTable().destroy();
    }
    reconsttablasuc(){
        this.tablasucursales();
    }
    actualizaralerta(){
        swal({
            position: 'center',
            icon: "success",
            title: 'se edito el usuario',
            buttons: false,
            timer: 1000
          })
    }
    borraralerta(id){
        swal({
            title: "esta seguro",
            text: "despúes de borrar, no se pude recuperar",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
               this.borrar(id);

              swal("el usuario se borro satisfactoriamente", {
                icon: "success",
                buttons: false,
                timer: 3000
              });
            } else {
              
            }
          });
    }
    guardarusuario(){
        
    }
  
}