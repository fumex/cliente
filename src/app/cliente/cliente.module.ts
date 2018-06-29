import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from './services/cliente.service';
import { ClienteAddComponent } from './components/cliente-add.component';
import { ClienteEditComponent } from './components/cliente-edit.component';

@NgModule({
    imports:[
        CommonModule,
        FormsModule
    ],
    declarations:[
        ClienteAddComponent,
        ClienteEditComponent,
    ],
    providers:[
      ClienteService  
    ]
})
export class ClienteModule{}