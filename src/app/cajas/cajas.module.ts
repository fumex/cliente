import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CajasComponent } from './componentes/cajas.component';
import { CajasService } from './services/cajas.services';
import { DetalleCajasUsuarioService } from './services/detalle.cajas.usuarios.services';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastModule.forRoot(),
    ],
    declarations:[
        CajasComponent,
        
    ],
    providers:[
        CajasService,
        DetalleCajasUsuarioService
    ]

})
export class CajasModule{}