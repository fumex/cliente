import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmpleadoComponent } from '../empleado.component';
import { AuthGuard } from '../../guards/auth.guards';
import { ProveedorAddComponent } from '../../proveedor/components/proveedor-add.component';
import { ProfileComponent } from '../../auth/profile/profile.component';
import { TipoDocumentoAddComponent } from '../../TipoDocumento/components/documento-add.component';
import { TipoDocumentoEditComponent } from '../../TipoDocumento/components/documento-edit.component';
import { ProveedorListComponent } from '../../proveedor/components/proveedor-list.component';
import { ProveedorEditComponent } from '../../proveedor/components/proveedor-edit.component';

@NgModule({
    imports:[
        RouterModule.forChild([
            {
                path:'empleado',
                component:EmpleadoComponent,canActivate:[AuthGuard],canActivateChild:[AuthGuard],
                children:[
                    {
                        path:'',
                        component:EmpleadoComponent
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

                ]
            }
        ])
    ],
    exports:[
        RouterModule
    ]
})
export class EmpleadoRoutingModule{}