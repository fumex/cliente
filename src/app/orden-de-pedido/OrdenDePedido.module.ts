import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { OrdenPedidosService } from "./services/Ordendepedido.service";
import { OrdenDePedidoComponent } from "./componentes/OrdenDePedido.component";
import { pedidolistarcomponent } from "./componentes/ordendepedidolistar.component";
import { OrdenPedidoPdf } from "./componentes/ordenPedidoPdf.component";

@NgModule({
    declarations: [
        OrdenDePedidoComponent,
        pedidolistarcomponent,
        OrdenPedidoPdf,
      ],
      imports: [
        CommonModule,
        FormsModule
        
      ],
      providers: [
        OrdenPedidosService,
      ]
})
export class OrdenDePedidoModule{
    
}