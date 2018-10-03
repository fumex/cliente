import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";


import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
//import {detalleimpuestoservice} from './services/detalle_impuesto.service'


@NgModule({
    declarations: [
        
      ],
      imports: [
        CommonModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastModule.forRoot(),
        
      ],
      providers: [

        //detalleimpuestoservice
      ]
})
export class detalleModule{
    
}