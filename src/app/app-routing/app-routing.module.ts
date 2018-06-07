import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, Routes, ActivatedRoute } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { AuthService } from '../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@NgModule({
    imports: [
      RouterModule.forRoot([
        { path: 'auth/login', component: LoginComponent },
      ])
    ],
    declarations: [],
    exports: [ RouterModule]
  })
  export class AppRoutingModule { 
  }
