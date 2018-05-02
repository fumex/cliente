import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthService } from './services/auth.service';



@NgModule({
    imports:[
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule
    ],
    declarations:[
        LoginComponent,
        ProfileComponent
    ],
    providers:[
        AuthService
    ]
})
export class AuthModule{ }