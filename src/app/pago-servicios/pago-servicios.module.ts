import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicioAddComponent } from './components/servicio-add.component';
import { ServicioPagoService } from './services/servicio.service';
import { ServicioAnularComponent } from './components/servicio-anular.component';
import { ServicioListComponent } from './components/servicio-list.component';

@NgModule({
    imports:[
        CommonModule,
        FormsModule
    ],
    declarations:[
        ServicioAddComponent,
        ServicioAnularComponent,
        ServicioListComponent
    ],
    providers:[
        ServicioPagoService
    ]

})
export class ServiciosModule{}