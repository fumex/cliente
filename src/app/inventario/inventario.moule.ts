import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { InventarioComponent} from "./componentes/inventario.component";
import { InventarioService } from "./services/inventario.service";
import { InventarioListComponent} from "./componentes/inventario.list.component";

@NgModule({
    declarations: [
        InventarioComponent,
        InventarioListComponent
      ],
      imports: [
        CommonModule,
        FormsModule
        
      ],
      providers: [
        InventarioService
      ]
})
export class InventarioModule{
    
}