import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from '../admin.component';
import { AuthGuard } from '../../guards/auth.guards';
import { ProfileComponent } from '../../auth/profile/profile.component';

import { AdminContentComponent } from '../admin-content/admin-content.component';
import { ProveedorAddComponent } from '../../proveedor/components/proveedor-add.component';

import { ProductosComponent } from '../../productos/componentes/productos.component';
import {AlmacenesComponent} from '../../Almacenes/componentes/almacenes.component';

import{ProductosEditComponent}from '../../productos/componentes/producto-edit.component';
import{InventarioComponent} from '../../inventario/componentes/inventario.component';
import{AlmacenComponent} from '../../almacen/componentes/almacen.component';

import { TipoProveedor } from '../../proveedor/components/tipo-proveedor.component';
import { PagoAddComponent } from '../../pago/components/pago-add.component';
import { PagoListComponent } from '../../pago/components/pago-list.component';
import { ProveedorListComponent } from '../../proveedor/components/proveedor-list.component';
import { ProveedorEditComponent } from '../../proveedor/components/proveedor-edit.component';



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
                    { path:'transaccion/list', component:PagoListComponent},
                    { path:'profile',component:ProfileComponent},
                    { path:'productos',component:ProductosComponent},
                    { path:'almacenes',component:AlmacenesComponent},
                    { path:'productos/:id',component:ProductosEditComponent},
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