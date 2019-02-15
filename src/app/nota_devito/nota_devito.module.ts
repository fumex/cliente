import { forwardRef,NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotaDevitoComponent } from './components/nota_devito.component';
import { NotaDebitoService } from './services/nota_devito.service';

@NgModule({
    declarations:[
        NotaDevitoComponent,
    ],
    imports:[
        CommonModule,
        FormsModule,
    ],
    providers:[ 
        NotaDebitoService,
    ]
})
export class nota_debitoModule{

}