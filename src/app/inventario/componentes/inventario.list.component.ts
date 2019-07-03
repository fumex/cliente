import { Component } from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import{InventarioService}from '../services/inventario.service';
import{inventario} from '../modelos/inventario';
import{AlmacenesService}from '../../Almacenes/services/almacenes.service';
import{almacen}from '../../Almacenes/modelos/almacenes';
import{ProductosfiltradoporAlmacenModel} from '../modelos/almacenproducto';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';
import { PermisosRolesModel } from '../../usuarios/modelos/permisos_roles';
import { environment } from '../../../environments/environment';
import { UsuarioService } from '../../usuarios/services/usuarios.service';


declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
    selector: 'inventario-list',
    templateUrl: '../views/inventario-list.component.html',
    providers: [InventarioService,AlmacenesService]
  })
  export class InventarioListComponent{
    public titulo:string;
    public cantotal:number;
    public multi:number;
    public mostrareporte;
    public total:number;
    public ident;
    public id:number;
    public almacenselec;
    public inventarios:Array<inventario>=[];
    public cojeinventarioi:inventario;
    public almacenes:almacen;
    public productos:ProductosfiltradoporAlmacenModel[];
    public movimientos:Array<inventario>=[];
    public mostrabproductos;
    public vertablaproductos;
    public idalmacen;
    public idproducto;
    public ocutarformulario;
    public user:User;
    public url;
    public mandar:PermisosRolesModel;
    public verpag=null;
      constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _InventarioService:InventarioService,
        private _almacenesService:AlmacenesService,
        private auth:AuthService,
        private _UsuarioService:UsuarioService,
      ){
        this.url=environment.url+'admin/reporteInventario';
        this.user=this.auth.getUser();
        this.mandar = new PermisosRolesModel(this.user.id,null,this.url,null,null);
        let i=0; 
        this._UsuarioService.getpermisos(this.mandar).subscribe(
            res=>{
                console.log(res)
                if(res.mensaje==true){
                    this.verpag=true;
                }else{
                    if(res.mensaje!=false){
                        this.verpag=true;
                    }else{
                        console.log('1')
                        this._router.navigate(['/'+this.user.rol]);
                    }
                }
                
            },
            err=>{
                console.log(<any>err);
            }
        )
        this.titulo = "reporte de almacen";
        this.tabla();
        //this.tabla2();
        this.cojeinventarioi=new inventario(0,'','',0,0,0,0,'',0,0,0,0);
        this.mostrareporte=null;
        this.ident=null;
        this.almacenselec=0;
        this.mostrabproductos=null;
        this.vertablaproductos;
        this.id=0;
        this.idalmacen=0;
        this.idproducto=0;
        this.ocutarformulario=null;
        
      }
        ngOnInit(){
        this.mostraralmacen();
        }  
        cambio(id){
            //this.mostrarProducto(this.almacenselec);
            this.mostrabproductos=1;
            this.mostrarProducto(id);
            this.almacenselec=id;
            
        }
        buscarreporte(producto,almacen){
            this.mostrareporte=1;
            this.idalmacen=producto;
            this.idproducto=almacen;
            this.ocutarformulario=producto;
            this.destruirtablaprinmcipal();
            this.reconstruirtablaprincipal();
            this.almacenselec=0;

        }
        mostrar(){
            this.id=0;
            let descrip=null;
            this.cojeinventarioi.id_producto=  this.idalmacen;
            this.cojeinventarioi.id_almacen= this.idproducto;
            this._InventarioService.SeleccionarInventario(this.cojeinventarioi).subscribe(
                result=>{
                    console.log(result);
                    this.inventarios=result;
                    
                   //console.log(this.inventarios);
                    while(this.id<this.inventarios.length){
                        descrip=this.inventarios[this.id].descripcion;
                        this.movimientos.push(this.inventarios[this.id]);
                        
                        if(this.id>0)
                        {
                            if(this.inventarios[this.id].tipo_movimiento!=1)
                            {
                                this.cantotal=this.inventarios[this.id].cantidad+this.movimientos[this.id-1].id_almacen;
                                this.total=(this.inventarios[this.id].cantidad*this.inventarios[this.id].precio)+this.movimientos[this.id-1].id;
                                
                                this.movimientos[this.id].id_almacen=this.cantotal;
                                this.movimientos[this.id].id=this.total;
                                this.multi=this.inventarios[this.id].cantidad*this.inventarios[this.id].precio;
                                this.movimientos[this.id].descripcion=this.multi.toFixed(2);;

                            }else{
                                this.cantotal=this.movimientos[this.id-1].id_almacen-this.inventarios[this.id].cantidad;
                                this.total=this.movimientos[this.id-1].id-this.inventarios[this.id].cantidad*this.inventarios[this.id].precio;
                                this.movimientos[this.id].id_almacen=this.cantotal;
                                this.movimientos[this.id].id=this.total;
                                this.multi=this.inventarios[this.id].cantidad*this.inventarios[this.id].precio;
                                this.movimientos[this.id].descripcion=this.multi.toFixed(2);;
                            }
                        }else{
                            if(this.inventarios[this.id].tipo_movimiento!=1)
                            {
                                this.cantotal=this.inventarios[this.id].cantidad;
                                this.total=this.inventarios[this.id].cantidad*this.inventarios[this.id].precio;
                                this.movimientos[this.id].id_almacen=this.cantotal;
                                this.movimientos[this.id].id=this.total;
                                this.multi=this.inventarios[this.id].cantidad*this.inventarios[this.id].precio;
                                this.movimientos[this.id].descripcion=this.multi.toFixed(2);

                            }else{
                                this.cantotal=0-this.inventarios[this.id].cantidad;
                                this.total=0-this.inventarios[this.id].cantidad * this.inventarios[this.id].precio;
                                this.movimientos[this.id].id_almacen=this.cantotal;
                                this.movimientos[this.id].id=this.total;
                                this.multi=this.inventarios[this.id].cantidad*this.inventarios[this.id].precio;
                                this.movimientos[this.id].descripcion=this.multi.toFixed(2);
                            }
                            
                        }
                        this.inventarios[this.id].descripcion=descrip;
                        this.id++;

                    }
                    //console.log(this.cantotal);
                    console.log(this.movimientos);

                },
                error=>{
                    console.log(<any>error);
                }   
            );
            this.cantotal=0;
            this.total=0;
            this.id=0;
        }
        
        cerrar(){
            this.id=0;
            this.mostrareporte=null;
            this.ocutarformulario=null;
            this.idalmacen=0;
            this.idproducto=0;
            this.movimientos.splice(1);
            while(this.id<this.movimientos.length)
            {
                this.movimientos.splice(this.id,1);
                this.id=this.id+1;
            }
            this.id=0;
            this.cojeinventarioi.id_almacen=0;
        }
        mostraralmacen(){
            this._almacenesService.mostraalmacenusuario(this.user.id).subscribe(
                result=>{
                    this.almacenes=result;
                    //console.log(result);
                },
                error=>{
                    console.log(<any>error);
                }   
            );
    
        }
    
        mostrarProducto(id){
        this.ident=id;
        this._InventarioService.seleccionarproductos(id).subscribe(
            result=>{
                
                this.productos=result;
                this.destruirtablaproductos();
                this.reconstruirtablaproductos();
                console.log(result);
             },
             error=>{
                 //console.log(<any>error);
            }   
            );
        }
        destruirtablaproductos(){	
            var table = $('#tablaproducto').DataTable(); table .clear() ;
            $('#tablaproducto').DataTable().destroy();
        }
        reconstruirtablaprincipal(){
            this.tabla();
            this.mostrar();
        }
        reconstruirtablaproductos(){
            this.tabla2();
        }
        destruirtablaprinmcipal(){	
            var table = $('#mytable').DataTable(); table .clear() ;
            $('#mytable').DataTable().destroy();
        }
        tabla(){
            //this.mostrar();
           
            setTimeout(function(){
                $(function(){
                     $('#mytable').DataTable({
                         dom: 'Bfrtip',
                         buttons: [
                             'copy', 'csv', 'excel', 'pdf', 'print'
                         ]
                     });
                });
            },3000);
        }
        tabla2(){
            setTimeout(function(){
                $(function(){
                     $('#tablaproducto').DataTable();
                });
            },500);
        }

  }