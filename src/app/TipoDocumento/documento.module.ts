import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoDocumentoListComponent } from './components/documento-list.component';
import { DocumentoService } from './services/documento.service';
import { TipoDocumentoAddComponent } from './components/documento-add.component';
import { TipoDocumentoEditComponent } from './components/documento-edit.component';

@NgModule({
    imports:[
       CommonModule,
       FormsModule     
    ],
    declarations:[
        TipoDocumentoListComponent,
        TipoDocumentoAddComponent,
        TipoDocumentoEditComponent
    ],
    providers:[
        DocumentoService
    ]
})
export class TipoDocumentoModule{}