import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { OrdenPedidosService } from "./services/Ordendepedido.service";
import { OrdenDePedidoComponent } from "./componentes/OrdenDePedido.component";

@NgModule({
    declarations: [
        OrdenDePedidoComponent,
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