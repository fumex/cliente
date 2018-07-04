import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpresaAddComponent } from './components/empresa-add.component';
import { EmpresaService } from './services/empresa.service';

@NgModule({
    imports:[
        CommonModule,
        FormsModule
    ],
    declarations:[
        EmpresaAddComponent,
    ],
    providers:[
        EmpresaService
    ]
})
export class EmpresaModule{}