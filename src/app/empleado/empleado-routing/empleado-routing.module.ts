import { NgModule } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, Routes } from '@angular/router';
import { EmpleadoComponent } from '../empleado.component';
import { AuthGuard } from '../../guards/auth.guards';
import { ProveedorAddComponent } from '../../proveedor/components/proveedor-add.component';
import { ProfileComponent } from '../../auth/profile/profile.component';
import { TipoDocumentoAddComponent } from '../../TipoDocumento/components/documento-add.component';
import { TipoDocumentoEditComponent } from '../../TipoDocumento/components/documento-edit.component';
import { ProveedorListComponent } from '../../proveedor/components/proveedor-list.component';
import { ProveedorEditComponent } from '../../proveedor/components/proveedor-edit.component';
import { EmpleadoContentComponent } from '../empleado-content/empleado-content.component';
import { AuthService } from '../../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@NgModule({
    imports:[
        RouterModule.forChild([
            {
                path:'empleado',
                component:EmpleadoComponent,canActivate:[AuthGuard],canActivateChild:[AuthGuard],
                data:{
                    expectedRole: 'empleado'
                },
                children:[
                    {
                        path:'',
                        component:EmpleadoContentComponent
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
export class EmpleadoRoutingModule{
    public url;
    public rol;
    public ruta;

    constructor(
        private aurth:AuthService,
        private http:HttpClient,
        private router:Router,
        private _route: ActivatedRoute,
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