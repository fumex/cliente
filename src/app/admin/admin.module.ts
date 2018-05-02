import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminLeftSideComponent } from './admin-left-side/admin-left-side.component';
import { AdminFooterComponent } from './admin-footer/admin-footer.component';
import { AdminRoutingModule } from './admin-routing/admin-routing.module';


@NgModule({
    imports:[
        CommonModule,
        AdminRoutingModule
    ],
    declarations:[
        AdminComponent,
        AdminHeaderComponent,
        AdminLeftSideComponent,
        AdminFooterComponent
    ],
    exports:[AdminComponent]
})
export class AdminModule{}