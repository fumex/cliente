import { Component, Input } from '@angular/core';
import {Router,ActivatedRoute,Params}from '@angular/router';
import{InventarioService}from '../services/inventario.service'
import{AlmacenesService}from '../../Almacenes/services/almacenes.service';
import{ProductoService} from '../../productos/services/producto.service';
import{inventario} from '../modelos/inventario';
import{almacen}from '../../Almacenes/modelos/almacenes';
import{ProductosfiltradoporAlmacenModel} from '../modelos/almacenproducto';
import {AuthService} from '../../auth/services/auth.service';
import { User } from '../../auth/interfaces/user.model';
import { PermisosRolesModel } from '../../usuarios/modelos/permisos_roles';
import { environment } from '../../../environments/environment';
import { UsuarioService } from '../../usuarios/services/usuarios.service';


declare var jQuery:any;
declare var $:any;
declare var swal:any;

@Component({
  selector: 'inventario',
  templateUrl: '../views/inventario.component.html',
  providers: [InventarioService,AlmacenesService,ProductoService,AuthService]
})
export class InventarioComponent{
    public titulo:string;
    public ident;
    public id;
    public almacenselec;
    public inventarios:inventario[];
    public inventario:inventario;
    public inventario2:inventario;
    public movimientos:Array<inventario>=[];
    public almacenes:almacen;
    public almacene:almacen;
    public productos:ProductosfiltradoporAlmacenModel;
    public mostrabproductos;
    public mostarguardar;
    public vertablaproductos;
    public input;
    public usuario;
    public otroalmacenvalid;
    public user:User;
    public url;
    public mandar:PermisosRolesModel;
    public verpag=null;
	constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _InventarioService:InventarioService,
        private _almacenesService:AlmacenesService,
        private _ProductoService:ProductoService,
        private auth:AuthService,
        private _UsuarioService:UsuarioService,
    ){
        this.url=environment.url+'admin/inventario';
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
        this.titulo = "Ajustes de inventario";
        //this.productos=new ProductosfiltradoporAlmacenModel(0,'','',0,0,'',0,0);
        this.inventario=new inventario(null,'','',0,null,0,0,null,0,0,0,0);
        this.inventario2=new inventario(0,'','',0,0,0,0,'',0,0,0,0);
        this.ident=null;
        this.tabla();
        this.almacenselec=0;
        this.mostrabproductos=0;
        this.mostarguardar=0;
        this.vertablaproductos;
        this.id=0;
        this.usuario=this.auth.getUser();;
        this.otroalmacenvalid=null;
    }

    ngOnInit(){
        this.mostraralmacen();
        //this.mostrarProducto(this.almacenselec);
        this.mostrarveralmacen(this.almacenselec);
    }  
    cambio(id){
        //console.log(id);
        this.mostrabproductos=1;
        this.almacenselec=id;
        this.mostrarProducto(this.almacenselec);
        console.log(this.almacenselec);
        this.mostrarveralmacen(this.almacenselec);
    }
    //elemento retirado
    addcantidad(idente,idpro,cantida){
        this.mostarguardar=this.mostarguardar+1;
        this.productos[idente].id=null;
        this.inventario2.id=idente;
        this.inventario2.id_producto=idpro;
        this.inventario2.tipo_movimiento=1;
        this.inventario2.cantidad=cantida;
        this.movimientos.push(this.inventario2);
        console.log(this.inventario);
        /*this.inventario2.id_producto=null;
        this.inventario2.cantidad=null;*/
        this.inventario2=new inventario(0,'','',0,0,0,0,'',0,0,0,0);
        console.log(this.productos)
        console.log(this.movimientos);

    }
    //selecciona el producto que sera reducido
    quitarcantidad(idindice){
        this.mostarguardar=this.mostarguardar-1;
        this.productos[idindice].canti=0;
        //this.pedidos.splice(index,1);
        while(this.id<this.movimientos.length){
            if(this.movimientos[this.id].id===idindice)
            {
               
                this.productos[idindice].id=this.movimientos[this.id].id_producto;
                this.movimientos.splice(this.id,1);
            }
            this.id=this.id+1;
        }
        this.id=0;
        console.log(this.movimientos);
    }
    //valida la opcion otro de el combobox
    validacionotro(des){
        if(this.inventario.opciones==null){
            this.inventario.opciones='otro';
        }
    }
    //guarda en la tabla movimientos los ajustes q se hagan
    guardarmoviemientos(){
        
        while(this.id<this.movimientos.length){
            console.log(this.movimientos[this.id]);
            this.movimientos[this.id].descripcion=this.inventario.descripcion;
            this.movimientos[this.id].id_almacen=this.inventario.id_almacen;
            this.movimientos[this.id].opciones=this.inventario.opciones;
            this.movimientos[this.id].escoja=this.inventario.escoja;
            this.movimientos[this.id].usuario=this.usuario.id;
            this.inventario2=this.movimientos[this.id];
            console.log(this.inventario2);

            this._InventarioService.addInventario(this.inventario2).subscribe(
                result=>{
                    this.limpiar();
                    console.log(result);
                    this.almacenselec=null;
                },
                error=>{
                    console.log(<any>error);
                }
    
            )
            this.id=this.id+1
        }
        console.log(this.inventario2);
        this.id=0;
    }
    //muestra el(los) almacen(es) al que el usuario tenga acceso
    mostrarveralmacen(almacenselec){
        this._almacenesService.veralmacen(this.almacenselec).subscribe(
            response => {
                this.almacene = response;
                console.log(response);
            },
            error => {
                console.log(<any>error);
                }
            );
    }
    
    actualizar(id){
        this.ident=id;
        console.log(this.almacenselec);
        if(id=='tranferencia entre almacenes'){
            this.otroalmacenvalid=null;
        }
        
    }
    validarotroalmacen(id){
        this.otroalmacenvalid=id;
    }
  
    mostraralmacen(){
        
        this._almacenesService.mostraalmacenusuario(this.usuario.id).subscribe(
            result=>{
                this.almacenes=result;
                console.log(result);
            },
            error=>{
                console.log(<any>error);
            }   
        );

    }

    mostrarProducto(id){
    this._InventarioService.seleccionarproductos(id).subscribe(
        result=>{
            this.destruir();
            this.reconstruir();
            this.productos=result;
            
            console.log(result);
         },
         error=>{
             console.log(<any>error);
        }   
        );
    }
    limpiar(){
        this.almacenselec=0;
        this.mostarguardar=0;
        this.mostrabproductos=0;
        this.inventario=new inventario(0,'','',0,0,0,0,'',0,0,0,0);
        this.inventario2=new inventario(0,'','',0,0,0,0,'',0,0,0,0);
        let indice=0;
        while(indice<this.movimientos.length){
            this.movimientos.splice(0,1);
            indice=indice+1;
        }
    }

    iralmacen(){
        this._router.navigate(['/admin/almacenes']);
    }
    irproducto(){
        this._router.navigate(['/admin/productos']);
    }
    limitar(numero,stock,id){
       
        this.input =document.activeElement;
        console.log(stock);
        console.log(this.input.value);
        if(numero>stock )
        {
            this.input.value = stock;
            this.input.style="border: 0.3px solid red;";
            this.alerta(); 
        }else{
            if(numero<1){
                this.input.value = 1;
                this.alertanegativa();  
            }else{
                this.input.style="border: 0.3px solid #3bc1ff;";
            }
           
        }
       
       
    }
    alerta(){
        swal({
        title: 'no existe esa cantidad en el almacen',
        timer: 1000,
       })
    }
    alertanegativa(){
        swal({
            title: 'deve ingresar un valor mayor a 0',
            timer: 1000,
           })
    }
    tabla(){
        setTimeout(function(){
            $(document).ready(function() {
                 $('#mytable').DataTable();
            });
        },1500);
    }
    destruir(){	
        var table = $('#mytable').DataTable(); table .clear() ;
        $('#mytable').DataTable().destroy();
    }
    reconstruir(){
        this.tabla();
    }
    alertamodificar(){

        //this.modificarproducto=null;
        //console.log(this.ident + '' + this.modificarproducto);
        swal({
            title: "esta seguro",
            text: "los datos que cambie no podran resttablecerce",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.guardarmoviemientos();
              swal( {
                title: "su ajuste se agrego correctamente",
                text: "puede revisarlo en la ventana de reportes",
                icon: "success",
              });
            } else {
              
            }
          });
    }
}