import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, Routes } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { AuthService } from '../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
var user:any;
const     routes :   Routes   = [
    { path:'auth/login',component:LoginComponent},  
] ;
@NgModule({
    imports:[
        RouterModule.forRoot(
            //{ path:'', redirectTo:'', pathMatch:'full' },
            routes )
    ],
    declarations:[],
    exports:[RouterModule]
})
export class AppRoutingModule{
   public variable;
    constructor(
       private aurth:AuthService,
       private http:HttpClient
    ){
        
    this.http.get<any>(`${environment.api_url}/auth/me`).subscribe(data=>{
        const   routes :   Routes   =   [ 
            { path:'', redirectTo:data.user.rol, pathMatch:'full' } , 
            
        ];
            /*console.log(data)
            RouterModule.forRoot([
            { path:'', redirectTo:data.user.name, pathMatch:'full' },                
        ])*/
        });
    }     
}