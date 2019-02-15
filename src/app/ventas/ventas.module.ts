import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DetalleCajasService } from "./services/DetalleCajas.service";
import { VentasService} from './services/Ventas.service';
import { VentasComponent } from "./componentes/ventas.component";
import { ResumenCajasAbiertasComponent} from './componentes/CajasAbiertas.component';
import { AnularVentaComponent} from './componentes/ventas_anular.component';
import { ReportesComponent} from './componentes/reportes.component';
import { ImprimirNotaCreditoComponent} from './componentes/imprimirnota.component';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
@NgModule({
    declarations: [
        VentasComponent,
        ImprimirNotaCreditoComponent,
        ResumenCajasAbiertasComponent,
        AnularVentaComponent,
        ReportesComponent,
      ],
      imports: [
        CommonModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastModule.forRoot(),
        
      ],
      providers: [
        DetalleCajasService,
        VentasService
      ]
})
export class VentasModule{
    
}