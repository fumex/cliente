import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UsuarioService } from "./services/usuarios.service";
import { usuarioscomponent } from "./componentes/usuarios.component";

@NgModule({
    declarations: [
        usuarioscomponent,

      ],
      imports: [
        CommonModule,
        FormsModule
        
      ],
      providers: [
        UsuarioService,
      ]
})
export class UsuariosModule{
    
}