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

import {ProductosListarComponent} from '../../productos/componentes/productos-list.component';

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
                    { path:'productos',component:ProductosComponent},
                    { path:'productos/list',component:ProductosListarComponent},
                    { path:'almacenes',component:AlmacenesComponent},
                    { path:'almacen',component:AlmacenComponent},
                    { path:'pedido',component:OrdenDePedidoComponent},
                    { path:'pedido/listar',component:pedidolistarcomponent},
                    { path:'inventario',component:InventarioComponent},
                    { path:'reporteInventario',component:InventarioListComponent}, 
                    { path:'usuarios',component:usuarioscomponent}, 
                    { path:'modificarcontraseña',component:EditUsuariosp},
                    { path:'editarusuario',component:EditarUsuarioPersonal}
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
        this.url='http://localhost:4200';
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
