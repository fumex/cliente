import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'modificar-usuariopersonal',
  templateUrl: '../views/EditUserAutenticacion.html',
})
export class EditUsuariosp implements OnInit {
  public f:FormGroup;
  errorCredentials=false;
  public user:any;
  public rol;
  constructor(
    private formBuilder:FormBuilder,
    private authService:AuthService,
    private router:Router
  ) { }

  ngOnInit() {

    this.f=this.formBuilder.group({
      email: [null,[Validators.required, Validators.email]],
      password:[null, [Validators.required]]
    });
  }
  
  onSubmit(){

    this.authService.modificar(this.f.value).subscribe(
      response=>{
        console.log(response);
      },
      (errorResponse:HttpErrorResponse)=>{
        if(errorResponse.status===401){
          this.errorCredentials=true;
        }
      }
    );
  }

}
