import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UsuarioService } from "./services/usuarios.service";
import { DettaleUsuarioService } from "./services/DetalleUsuario.service";
import { usuarioscomponent } from "./componentes/usuarios.component";
import { EditUsuariosp } from "./componentes/EditUserAutenticacion.component";

@NgModule({
    declarations: [
        usuarioscomponent,
        EditUsuariosp,
      ],
      imports: [
        CommonModule,
        FormsModule
        
      ],
      providers: [
        UsuarioService,
        DettaleUsuarioService,
      ]
})
export class UsuariosModule{
    
}