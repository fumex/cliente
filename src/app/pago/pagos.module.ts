import { NgModule } from '@angular/core';
import { PagoService } from './services/pago.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoAddComponent } from './components/pago-add.component';
import { PagoListComponent } from './components/pago-list.component';
import { PagoAnularComponent } from './components/pago-anular.component';
import { PagoReciboComponent } from './components/pago-recibo.component';



@NgModule({
    imports:[
        CommonModule,
        FormsModule,
    ],
    declarations:[
        PagoAddComponent,
        PagoListComponent,
        PagoAnularComponent,
        PagoReciboComponent
    ],
    providers:[
        PagoService   
    ]
})
export class PagoModule{}