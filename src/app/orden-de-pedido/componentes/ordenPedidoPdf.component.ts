import { Component, OnInit } from '@angular/core';
import { OrdenPedidosService } from '../services/Ordendepedido.service';
import { DetalleOrdenPedidosService } from '../../detalle-orden-de-pedido/services/DetalleOrdenPedido.service';
import { ProveedorService } from '../../proveedor/services/proveedor.service';
import { AlmacenesService } from '../../Almacenes/services/almacenes.service';
import { EmpresaService } from '../../empresa/services/empresa.service';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector:'orden-pdf',
    templateUrl:'../views/ordenPedido-pdf.html',
    providers:[OrdenPedidosService],
    styleUrls:['../style/ordenPedidoPdf.css']
})
export class OrdenPedidoPdf implements OnInit{
    public title:string;
    //-----------------Orden de Pedido----------------------
    public id_ordem:number;
    public id_almacen:number;
    public id_proveedor:number;
    public fecha_entrega:Date;
    public terminos:string;
    public user:User;
    constructor(
        private route:ActivatedRoute,
        private router:Router,
        //private ordenPedidoService:OrdenPedidosService,
      //  private ordenPediDetalle:DetalleOrdenPedidosService,
        private proveedoService:ProveedorService,
        private almacenService:AlmacenesService,
        private empresaService:EmpresaService,
        private auth:AuthService
    ){
        this.title="PDF Orden Pedido";
        this.user=this.auth.getUser();
    }
    ngOnInit(){
        
        
    }

    ordenPedido(){
        

    }
    listar(){
        this.router.navigate(['/'+this.user.rol+'/pedido/listar']);
    }
}