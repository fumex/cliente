import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { UsuarioModel} from '../modelos/usuarios'
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'modificar-usuariopersonal',
  templateUrl: '../views/EditUserAutenticacion.html',
  styleUrls: ['../styles/edituser.css']
})
export class EditUsuariosp implements OnInit {
    public titulo;
    public error=false;
    public user:any;
    public rol;
    public usuario:UsuarioModel;
    constructor(
        private authService:AuthService,
        private router:Router
    ) { 
        this.user=this.authService.getUser();
        this.titulo=this.user.email;
    }

    ngOnInit() {
    console.log(this.user);
    }
  
    onSubmit(){

    
    }

}
