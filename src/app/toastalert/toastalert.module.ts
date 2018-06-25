import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";



import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


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

      ]
})
export class tosastmodule{
    
}