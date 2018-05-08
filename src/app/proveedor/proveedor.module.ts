import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedorAddComponent } from './components/proveedor-add.component';
import { ProveedorService } from './services/proveedor.service';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports:[
        CommonModule,
        FormsModule
    ],
    declarations:[
        ProveedorAddComponent
    ],
    providers:[
        ProveedorService
    ]
})
export class ProveedorModule{}