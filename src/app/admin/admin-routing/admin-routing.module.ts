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
import{AlmacenComponent} from '../../almacen/componentes/almacen.component';

import { TipoProveedor } from '../../proveedor/components/tipo-proveedor.component';
import { PagoAddComponent } from '../../pago/components/pago-add.component';
import { PagoListComponent } from '../../pago/components/pago-list.component';
import {ProductosListarComponent} from '../../productos/componentes/productos-list.component';


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
                        path:'transaccion',
                        component:PagoAddComponent,
                    },
                    { path:'transaccion/list', component:PagoListComponent},
                    { path:'profile',component:ProfileComponent},
                    { path:'productos',component:ProductosComponent},
                    { path:'productos/list',component:ProductosListarComponent},
                    { path:'almacenes',component:AlmacenesComponent},
                    { path:'almacen',component:AlmacenComponent},
                    { path:'inventario',component:InventarioComponent}
                ]
            }
        ])
    ],
    exports:[
        RouterModule
    ]
})
export class AdminRoutingModule { }