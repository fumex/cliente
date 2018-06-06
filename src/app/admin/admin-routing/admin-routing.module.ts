import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
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

import { ProveedorListComponent } from '../../proveedor/components/proveedor-list.component';
import { ProveedorEditComponent } from '../../proveedor/components/proveedor-edit.component';
import { TipoDocumentoListComponent } from '../../TipoDocumento/components/documento-list.component';
import { TipoDocumentoAddComponent } from '../../TipoDocumento/components/documento-add.component';
import { TipoDocumentoEditComponent } from '../../TipoDocumento/components/documento-edit.component';

import{ OrdenDePedidoComponent} from '../../orden-de-pedido/componentes/OrdenDePedido.component';
import { PagoAnularComponent } from '../../pago/components/pago-anular.component';
import { ServicioAddComponent } from '../../pago-servicios/components/servicio-add.component';
import { ServicioAnularComponent } from '../../pago-servicios/components/servicio-anular.component';
import { ServicioListComponent } from '../../pago-servicios/components/servicio-list.component';





@NgModule({
    imports:[
        RouterModule.forChild([
            {
                path:'admin',
                component:AdminComponent,canActivate:[AuthGuard],canActivateChild:[AuthGuard],
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
                        path:'proveedor',
                        component:ProveedorAddComponent
                    },
                    {
                        path:'documento/list',
                        component:TipoDocumentoListComponent
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
                        path:'proveedor/list',
                        component:ProveedorListComponent
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
                    { path:'profile',component:ProfileComponent},
                    { path:'productos',component:ProductosComponent},
                    { path:'productos/list',component:ProductosListarComponent},
                    { path:'almacenes',component:AlmacenesComponent},
                    { path:'almacen',component:AlmacenComponent},
                    { path:'pedido',component:OrdenDePedidoComponent},
                    { path:'inventario',component:InventarioComponent},
                    { path:'reporteInventario',component:InventarioListComponent}, 
                ]
            }
        ])
    ],
    exports:[
        RouterModule
    ]
})
export class AdminRoutingModule { }