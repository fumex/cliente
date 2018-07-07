import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoPagoAddComponent } from './components/tipo_pago-add.component';
import { TipoPagoEditComponent } from './components/tipo_pago-edit.component';
import { TipoPagoService } from './services/tipo_pago.service';
@NgModule({
    imports:[
        CommonModule,
        FormsModule
    ],
    declarations:[
        TipoPagoAddComponent,
        TipoPagoEditComponent
        
    ],
    providers:[
        TipoPagoService
    ]
})
export class TipoPagoModule{}
