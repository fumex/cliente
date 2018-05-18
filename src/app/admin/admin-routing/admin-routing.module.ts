import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from '../admin.component';
import { AuthGuard } from '../../guards/auth.guards';
import { ProfileComponent } from '../../auth/profile/profile.component';
import { ProductosComponent } from '../../productos/componentes/productos.component';
import {AlmacenesComponent} from '../../Almacenes/componentes/almacenes.component';
import{ProductosAddComponent}from '../../productos/componentes/producto-add.components';
import{ProductosEditComponent}from '../../productos/componentes/producto-edit.component';
import{InventarioComponent} from '../../inventario/componentes/inventario.component';
import{AlmacenComponent} from '../../almacen/componentes/almacen.component';

@NgModule({
    imports:[
        RouterModule.forChild([
            {
                path:'admin',
                component:AdminComponent,canActivate:[AuthGuard],canActivateChild:[AuthGuard],
                children:[
                    { path:'profile',component:ProfileComponent},
                    { path:'productos',component:ProductosComponent},
                    { path:'productos/agregar',component:ProductosAddComponent},
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