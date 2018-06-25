import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProductoService } from "./services/producto.service";
import {UnidadService }from './services/unidad.service';
import { ProductosComponent } from "./componentes/productos.component";
import {categoriacomponent} from './componentes/categoria.component';
import{categoriaedit}from './componentes/categoria-edit.component';
import{ ProductosListarComponent}from './componentes/productos-list.component';
import{ unidadcomponent}from './componentes/unidad.component';
import{ unidadesedit} from './componentes/unidad-edit.component';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


@NgModule({
    declarations: [
        ProductosComponent,
        categoriacomponent,
        categoriaedit,
        ProductosListarComponent,
        unidadcomponent,
        unidadesedit,
        
      ],
      imports: [
        CommonModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastModule.forRoot(),
        
      ],
      providers: [
        ProductoService,
        UnidadService,
      ]
})
export class ProductoModule{
    
}