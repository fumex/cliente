import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import{environment} from '../../../environments/environment'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public f:FormGroup;
  errorCredentials=false;
  public user:any;
  public rol;
  constructor(
    private formBuilder:FormBuilder,
    private authService:AuthService,
    private router:Router
    

  ) {
    
   }
   respuesta(){
     return this.rol=this.user.user.rol;
   }
  ngOnInit() {

    this.f=this.formBuilder.group({
      email: [null,[Validators.required, Validators.email]],
      password:[null, [Validators.required]]
    });
  }
  
  onSubmit(){
   
    this.authService.login(this.f.value).subscribe(
      response=>{
        this.user=response;
        location.href=`${environment.url}`+this.user.user.rol;
         this.rol=this.user.user.rol;
      },
      (errorResponse:HttpErrorResponse)=>{
        if(errorResponse.status===401){
          this.errorCredentials=true;
        }
      }
    );
  }

}
