import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, Routes, ActivatedRoute } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { AuthService } from '../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthGuard } from '../guards/auth.guards';



@NgModule({
    imports: [
      RouterModule.forRoot([
        { 
          path: 'auth/login', component: LoginComponent
        },
        { path: '', redirectTo: 'admin', pathMatch: 'full' },
      ])
    ],
    declarations: [],
    exports: [ RouterModule]
  })
  export class AppRoutingModule { 
  }
