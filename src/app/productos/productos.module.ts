import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProductoService } from "./services/producto.service";
import { ProductosComponent } from "./componentes/productos.component";
import {categoriacomponent} from './componentes/categoria.component';
import{categoriaedit}from './componentes/categoria-edit.component';



@NgModule({
    declarations: [
        ProductosComponent,
        categoriacomponent,
        categoriaedit
      ],
      imports: [
        CommonModule,
        FormsModule
        
      ],
      providers: [
        ProductoService,
      ]
})
export class ProductoModule{
    
}