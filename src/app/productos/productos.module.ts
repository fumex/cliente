import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProductosAddComponent } from "./componentes/producto-add.components";
import { ProductoService } from "./services/producto.service";
import { ProductosComponent } from "./componentes/productos.component";
import { ProductosEditComponent } from "./componentes/producto-edit.component";

@NgModule({
    declarations: [
        ProductosAddComponent,
        ProductosComponent,
        ProductosEditComponent
      ],
      imports: [
        CommonModule,
        FormsModule
        
      ],
      providers: [
        ProductoService
      ]
})
export class ProductoModule{
    
}