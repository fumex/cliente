import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UsuarioService } from "./services/usuarios.service";
import { DettaleUsuarioService } from "./services/DetalleUsuario.service";
import { usuarioscomponent } from "./componentes/usuarios.component";
import { EditarUsuarioPersonal } from "./componentes/editaruserpersonal.component";
import { EditUsuariosp } from "./componentes/EditUserAutenticacion.component";
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        usuarioscomponent,
        EditUsuariosp,
        EditarUsuarioPersonal,
      ],
      imports: [
        CommonModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastModule.forRoot(),
        
      ],
      providers: [
        UsuarioService,
        DettaleUsuarioService,
      ]
})
export class UsuariosModule{
    
}