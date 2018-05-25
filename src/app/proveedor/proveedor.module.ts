import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedorAddComponent } from './components/proveedor-add.component';
import { ProveedorService } from './services/proveedor.service';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TipoProveedorService } from './services/tipoProveedor.service';
import { TipoProveedor } from './components/tipo-proveedor.component';
import { AdminRoutingModule } from '../admin/admin-routing/admin-routing.module';
import { ProveedorListComponent } from './components/proveedor-list.component';
import { ProveedorEditComponent } from './components/proveedor-edit.component';


@NgModule({
    imports:[
        CommonModule,
        FormsModule
    ],
    declarations:[
        ProveedorAddComponent,
        ProveedorListComponent,
        TipoProveedor,
        ProveedorEditComponent
    ],
    providers:[
        ProveedorService,
        TipoProveedorService
    ]
})
export class ProveedorModule{}