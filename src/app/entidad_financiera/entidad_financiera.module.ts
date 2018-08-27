import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntidadFinancieraComponent } from './components/entidad_financiera.component';
import { EntidadFinancieraService } from './services/entidad_financiera.service';
@NgModule({
    imports:[
        CommonModule,
        FormsModule
    ],
    declarations:[
        EntidadFinancieraComponent
    ],
    providers:[
        EntidadFinancieraService
    ]
})
export class entidadFinancieraModule{}
