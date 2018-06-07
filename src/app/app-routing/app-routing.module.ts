import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, Routes, ActivatedRoute } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { AuthService } from '../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const     routes :   Routes   = [
    { path:'auth/login',component:LoginComponent},  

] ;
@NgModule({
    imports:[
        RouterModule.forRoot(routes )
    ],
    declarations:[],
    exports:[RouterModule]
})
export class AppRoutingModule{
   /*public variable;
   public url;
   public rol;
   public pathName;
   public loc;
   public ruta;*/
    constructor(
      
           private _route: ActivatedRoute,
    ){
        /*this.url='http://localhost:4200';
        this.loc=window.location;
        this.pathName=this.loc.pathname.substring(0, this.loc.pathname.lastIndexOf('/'));
        this.http.get<any>(`${environment.api_url}/auth/me`).subscribe(data=>{
            
            this.ruta=this.loc.href.substring(0, this.loc.href.length + this.pathName.length - this.loc.pathname.length);
            this.rol=data.user.rol;
            if(this.url+'/'+data.user.rol!=this.ruta){
                if(this.aurth.check()==true && location.href==this.url+'/auth/login'){
                    this.router.navigate([data.user.rol]);
                }
            }
            
            const   routes :   Routes   =   [ 
                { path:'', redirectTo:data.user.rol, pathMatch:'full' } ,  
            ];
        });*/
    }     
}