import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AlmacenComponent} from "./componentes/almacen.component";
import { AlmaceneService } from "./services/almacen.services";

@NgModule({
    declarations: [
        AlmacenComponent,
      ],
      imports: [
        CommonModule,
        FormsModule
        
      ],
      providers: [
        AlmaceneService
      ]
})
export class AlmacenModule{
    
}