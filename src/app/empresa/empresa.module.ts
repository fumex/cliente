import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpresaAddComponent } from './components/empresa-add.component';
import { EmpresaService } from './services/empresa.service';
import { EmpresaPerfilComponent } from './components/empresa-perfil.component';

@NgModule({
    imports:[
        CommonModule,
        FormsModule
    ],
    declarations:[
        EmpresaAddComponent,
        EmpresaPerfilComponent,
    ],
    providers:[
        EmpresaService
    ]
})
export class EmpresaModule{}