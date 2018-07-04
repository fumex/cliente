import { NgModule } from '@angular/core';
import { ImpuestoService } from './services/impuesto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'ng2-toastr';
import { ImpuestoAddComponent } from './components/impuesto-add.component';
import { ImpuestoEditComponent } from './components/Impuesto-edit.component';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastModule.forRoot(),
    ],
    declarations:[
        ImpuestoAddComponent,
        ImpuestoEditComponent
    ],
    providers:[
        ImpuestoService
    ]
})
export class ImpuestoModule{}