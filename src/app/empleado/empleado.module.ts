import { NgModule } from '@angular/core';
import { EmpleadoComponent } from './empleado.component';
import { CommonModule } from '@angular/common';
import { EmpleadoRoutingModule } from './empleado-routing/empleado-routing.module';
import { EmpleadoHeaderComponent } from './empleado-header/empleado-header.component';
import { EmpleadoLeftSideComponent } from './empleado-left-side/empleado-left-side.component';
import { EmpleadoFooterComponent } from './empleado-footer/empleado-footer.component';
import { EmpleadoContentComponent } from './empleado-content/empleado-content.component';

@NgModule({

    imports:[
        CommonModule,
        EmpleadoRoutingModule
    ],
    declarations:[
        EmpleadoComponent,
        EmpleadoHeaderComponent,
        EmpleadoLeftSideComponent,
        EmpleadoFooterComponent,
        EmpleadoContentComponent
    ],
    exports:[EmpleadoComponent]
})
export class EmpleadoModule{}