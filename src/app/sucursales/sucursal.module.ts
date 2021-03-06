import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SucursalAddComponent } from './components/sucursal-add.component';
import { SucursalEditComponent } from './components/sucursal-edit.component';
import { SucursalService } from './services/sucursal.service';

@NgModule({
    imports:[
        CommonModule,
        FormsModule
    ],
    declarations:[
        SucursalAddComponent,
        SucursalEditComponent
    ],
    providers:[
        SucursalService
    ]

})
export class SucursalModule{}