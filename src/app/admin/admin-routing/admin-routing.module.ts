import { NgModule, Component } from '@angular/core';
import { RouterModule, Router, ActivatedRoute,Params, Routes } from '@angular/router';
import { AdminComponent } from '../admin.component';
import { AuthGuard } from '../../guards/auth.guards';
import { ProfileComponent } from '../../auth/profile/profile.component';

import { AdminContentComponent } from '../admin-content/admin-content.component';
import { ProveedorAddComponent } from '../../proveedor/components/proveedor-add.component';

import { ProductosComponent } from '../../productos/componentes/productos.component';
import {AlmacenesComponent} from '../../Almacenes/componentes/almacenes.component';

import{InventarioComponent} from '../../inventario/componentes/inventario.component';
import{InventarioListComponent} from '../../inventario/componentes/inventario.list.component';
import{AlmacenComponent} from '../../almacen/componentes/almacen.component';


import { PagoAddComponent } from '../../pago/components/pago-add.component';
import { PagoListComponent } from '../../pago/components/pago-list.component';


import { ProveedorEditComponent } from '../../proveedor/components/proveedor-edit.component';
import { TipoDocumentoAddComponent } from '../../TipoDocumento/components/documento-add.component';
import { TipoDocumentoEditComponent } from '../../TipoDocumento/components/documento-edit.component';
import { usuarioscomponent } from '../../usuarios/componentes/usuarios.component';
import { EditarUsuarioPersonal } from '../../usuarios/componentes/editaruserpersonal.component';
import { EditUsuariosp } from '../../usuarios/componentes/EditUserAutenticacion.component';
import{ OrdenDePedidoComponent} from '../../orden-de-pedido/componentes/OrdenDePedido.component';
import { pedidolistarcomponent} from '../../orden-de-pedido/componentes/ordendepedidolistar.component';


import { PagoAnularComponent } from '../../pago/components/pago-anular.component';
import { ServicioAddComponent } from '../../pago-servicios/components/servicio-add.component';
import { ServicioAnularComponent } from '../../pago-servicios/components/servicio-anular.component';
import { ServicioListComponent } from '../../pago-servicios/components/servicio-list.component';

import { LoginComponent} from '../../auth/login/login.component';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SucursalAddComponent } from '../../sucursales/components/sucursal-add.component';
import { SucursalEditComponent } from '../../sucursales/components/sucursal-edit.component';
import { ClienteAddComponent } from '../../cliente/components/cliente-add.component';
import { ClienteEditComponent } from '../../cliente/components/cliente-edit.component';
import { EmpresaAddComponent } from '../../empresa/components/empresa-add.component';
import { ImpuestoAddComponent } from '../../impuesto/components/impuesto-add.component';
import { ImpuestoEditComponent } from '../../impuesto/components/Impuesto-edit.component';
import { MonedaAddComponent } from '../../moneda/components/moneda-add.component';
import { MonedaEditComponent } from '../../moneda/components/moneda-edit.component';
import { TipoPagoAddComponent } from '../../tipo_pago/components/tipo_pago-add.component';
import { TipoPagoEditComponent } from '../../tipo_pago/components/tipo_pago-edit.component';

import { CajasComponent } from '../../cajas/componentes/cajas.component';
import { VentasComponent} from '../../ventas/componentes/ventas.component';
import { AnularVentaComponent} from '../../ventas/componentes/ventas_anular.component';
import { ResumenCajasAbiertasComponent} from '../../ventas/componentes/CajasAbiertas.component';

import { EmpresaPerfilComponent } from '../../empresa/components/empresa-perfil.component';
import { EmpresaEditComponent } from '../../empresa/components/empresa-edit.component';
import { PagoReciboComponent } from '../../pago/components/pago-recibo.component';
import { OrdenPedidoPdf } from '../../orden-de-pedido/componentes/ordenPedidoPdf.component';
import { unidadcomponent} from '../../productos/componentes/unidad.component';
import { EntidadFinancieraComponent} from '../../entidad_financiera/components/entidad_financiera.component';
import { EmisorAddComponent } from '../../emisor/components/emisor-add.component';
import { EmisorEditComponent } from '../../emisor/components/emisor-edit.component';


@NgModule({
   
    imports:[
        RouterModule.forChild([
            {
                path:'admin',
                component:AdminComponent,canActivate:[AuthGuard],canActivateChild:[AuthGuard],
                data:{
                    expectedRole:'admin',
                    id:1305,
                },
                children:[
                    {
                        path:'',
                        component:AdminContentComponent
                    },
                    {
                         path:'profile',
                         component:ProfileComponent
                    },
                    {
                        path:'documento',
                        component:TipoDocumentoAddComponent
                    },
                    {
                        path:'documento/edit/:id',
                        component:TipoDocumentoEditComponent
                    },
                    {
                        path:'proveedor',
                        component:ProveedorAddComponent
                    },
                    {
                        path:'proveedor/edit/:id',
                        component:ProveedorEditComponent
                    },
                    {
                        path:'transaccion',
                        component:PagoAddComponent,
                    },
                    { 
                        path:'transaccion/list',
                         component:PagoListComponent
                    },
                    {
                        path:'transaccion/anular',
                        component:PagoAnularComponent
                    },
                    {
                        path:'transaccion/recibo',
                        component:PagoReciboComponent
                    },
                    {
                        path:'servicio',
                        component:ServicioAddComponent
                    },
                    {
                        path:'servicio/anular',
                        component:ServicioAnularComponent
                    },
                    {
                        path:'servicio/list',
                        component:ServicioListComponent
                    },
                    {
                        path:'sucursal',
                        component:SucursalAddComponent
                    },
                    {
                        path:'sucursal/edit/:id',
                        component:SucursalEditComponent
                    },
                    {
                        path:'cliente',
                        component:ClienteAddComponent
                    },
                    {
                        path:'cliente/edit/:id',
                        component:ClienteEditComponent
                    },
                    {
                        path:'empresa',
                        component:EmpresaAddComponent
                    },
                    {
                        path:'empresa/edit/:id',
                        component:EmpresaEditComponent
                    },
                    {
                        path:'empresa/perfil',
                        component:EmpresaPerfilComponent
                    },
                    {
                        path:'impuesto',
                        component:ImpuestoAddComponent
                    },
                    {
                        path:'impuesto/edit/:id',
                        component:ImpuestoEditComponent
                    },
                    {
                        path:'moneda',
                        component:MonedaAddComponent
                    },
                    {
                        path:'moneda/edit/:id',
                        component:MonedaEditComponent
                    },
                    {
                        path:'tipo_pago',
                        component:TipoPagoAddComponent
                    },
                    {
                        path:'tipo_pago/edit/:id',
                        component:TipoPagoEditComponent
                    },
                    {
                        path:'emisor',
                        component:EmisorAddComponent
                    },
                    {
                        path:'emisor/edit',
                        component:EmisorEditComponent
                    },
                    { path:'productos',component:ProductosComponent},
                    { path:'almacenes',component:AlmacenesComponent},
                    { path:'almacen',component:AlmacenComponent},
                    { path:'pedido',component:OrdenDePedidoComponent},
                    { path:'pedido/recibo',component:OrdenPedidoPdf},
                    { path:'pedido/listar',component:pedidolistarcomponent},
                    { path:'inventario',component:InventarioComponent},
                    { path:'reporteInventario',component:InventarioListComponent}, 
                    { path:'usuarios',component:usuarioscomponent}, 
                    { path:'modificarcontraseña',component:EditUsuariosp},
                    { path:'editarusuario',component:EditarUsuarioPersonal},
                    { path:'cajas',component:CajasComponent},
                    { path:'ventas',component:VentasComponent},
                    { path:'resumenventas',component:ResumenCajasAbiertasComponent},
                    { path:'unidades',component:unidadcomponent},
                    { path:'EntidadFinaciera',component:EntidadFinancieraComponent},
                    { path:'anularventa',component:AnularVentaComponent},
                ]
            }
        ]),
    ],
    exports:[
        RouterModule
    ]
})
export class AdminRoutingModule { 
    public url;
    public rol;
    public ruta;
    constructor(
        private aurth:AuthService,
        private http:HttpClient,
        private router:Router,
        private _route: ActivatedRoute,
        //private _login:LoginComponent,
    ){
        this.url=environment.url;
        this.http.get<any>(`${environment.api_url}/auth/me`).subscribe(data=>{
;
            if(this.url+'/'+data.user.rol!=this.ruta){
                if(this.aurth.check()==true && location.href==this.url+'/auth/login'){
                    this.router.navigate([data.user.rol]);
                }
            }
            const   routes :   Routes   =   [ 
                { path:'', redirectTo:data.user.rol, pathMatch:'full' } ,  
            ];
        });
       
      
       
    }
}
