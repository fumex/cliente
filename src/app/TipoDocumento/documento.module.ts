import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';

import { DocumentoService } from './services/documento.service';
import { TipoDocumentoAddComponent } from './components/documento-add.component';
import { TipoDocumentoEditComponent } from './components/documento-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'ng2-toastr';

@NgModule({
    imports:[
       CommonModule,
       FormsModule,
       BrowserAnimationsModule,
       ToastModule.forRoot(),

    ],
    declarations:[
        TipoDocumentoAddComponent,
        TipoDocumentoEditComponent
    ],
    providers:[
        DocumentoService
    ]
})
export class TipoDocumentoModule{}