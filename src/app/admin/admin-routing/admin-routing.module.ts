import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from '../admin.component';
import { AuthGuard } from '../../guards/auth.guards';
import { ProfileComponent } from '../../auth/profile/profile.component';
import { ProductosComponent } from '../../productos/componentes/productos.component';
import{ProductosAddComponent}from '../../productos/componentes/producto-add.components';


@NgModule({
    imports:[
        RouterModule.forChild([
            {
                path:'admin',
                component:AdminComponent,canActivate:[AuthGuard],canActivateChild:[AuthGuard],
                children:[
                    { path:'profile',component:ProfileComponent},
                    { path:'productos',component:ProductosComponent},
                    { path:'productos/agregar',component:ProductosAddComponent}
                ]
            }
        ])
    ],
    exports:[
        RouterModule
    ]
})
export class AdminRoutingModule { }