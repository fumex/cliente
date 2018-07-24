import { NgModule } from '@angular/core';
import { PagoService } from './services/pago.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoAddComponent } from './components/pago-add.component';
import { PagoListComponent } from './components/pago-list.component';
import { PagoAnularComponent } from './components/pago-anular.component';
import { AngularPDFMakeModule } from '@supply-chain-ventures.com/angular-pdfmake';


@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        AngularPDFMakeModule
    ],
    declarations:[
        PagoAddComponent,
        PagoListComponent,
        PagoAnularComponent,
    ],
    providers:[
        PagoService   
    ]
})
export class PagoModule{}