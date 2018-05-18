import { NgModule } from '@angular/core';
import { PagoService } from './services/pago.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoAddComponent } from './components/pago-add.component';
import { PagoListComponent } from './components/pago-list.component';



@NgModule({
    imports:[
        CommonModule,
        FormsModule
    ],
    declarations:[
        PagoAddComponent,
        PagoListComponent
      
    ],
    providers:[
        PagoService   
    ]
})
export class PagoModule{}