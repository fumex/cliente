import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmisorService } from './services/emisor.service';
import { EmisorAddComponent } from './components/emisor-add.component';
import { EmisorEditComponent } from './components/emisor-edit.component';

@NgModule({
    imports:[
        CommonModule,
        FormsModule
    ],
    declarations:[
        EmisorAddComponent,
        EmisorEditComponent
    ],
    providers:[
        EmisorService
    ]
})
export class EmisorModule{}