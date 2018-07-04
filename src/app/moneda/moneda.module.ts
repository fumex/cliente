import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'ng2-toastr';
import { MonedaAddComponent } from './components/moneda-add.component';
import { MonedaEditComponent } from './components/moneda-edit.component';
import { MonedaService } from './services/moneda.service';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastModule.forRoot(),
 
     ],
     declarations:[
         MonedaAddComponent,
         MonedaEditComponent
     ],
     providers:[
         MonedaService
     ]
})
export class MonedaModule{}