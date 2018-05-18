import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AlmacenesComponent} from "./componentes/almacenes.component";
import { AlmacenesService } from "./services/almacenes.service";

@NgModule({
    declarations: [
        AlmacenesComponent,
      ],
      imports: [
        CommonModule,
        FormsModule
        
      ],
      providers: [
        AlmacenesService
      ]
})
export class AlmacenesModule{
    
}