import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { UsuarioModel} from '../modelos/usuarios'
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {AlmacenesService}from '../../Almacenes/services/almacenes.service';
import{almacen} from '../../Almacenes/modelos/almacenes';
import { UsuarioService } from '../services/usuarios.service';

declare var jQuery:any;
declare var $:any;
declare var swal:any;


@Component({
  selector: 'modificar-usuariopersonal',
  host: {
    '(document:click)': 'handleClick($event)',
    },
  templateUrl: '../views/EditUserAutenticacion.html',
  providers:[UsuarioService],
  styleUrls: ['../styles/edituser.css']

})
export class EditUsuariosp implements OnInit {
    public paswor;
    public confirmar;
    public titulo;
    public error=false;
    public user:any;
    public rol;
    public canterror;
    public mostrar;
    public resultado:any;
    public usuario:UsuarioModel;
    public almacenes:almacen;
    public nombres:Array<1>=[]
    public query = '';
    public filteredList = [];
    public elementRef; 
    public image;
    public filesToUpload;   
    constructor(
        private _almacenesService:AlmacenesService,
        private _usuarioservice:UsuarioService,
        private authService:AuthService,
        private router:Router,
        private myElement: ElementRef,
    ) { 
        this.user=this.authService.getUser();
        this.elementRef = myElement;
        this.usuario=new UsuarioModel(null,null,null,null,null,null,null,null,null,null,null,null,null)
        this.titulo=this.user.email;
        this.mostrar=null;
        this.paswor=null;
        this.confirmar=null;
        this.canterror=0;
        this.filter();
        
    }

    ngOnInit() {
    this.rol=this.user.name;
    console.log(this.rol);
    this.mostraralmacen();
    }
    filter() {
        if (this.query !== ""){
            this.filteredList = this.nombres.filter(function(el){
                return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            }.bind(this));
        }else{
            this.filteredList = [];
        }
    }
     
    select(item){
        this.query = item;
        this.filteredList = [];
    }
    handleClick(event){
        var clickedComponent = event.target;
        var inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
           clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
         if(!inside){
             this.filteredList = [];
         }
     }

    onSubmit(){

    
    }
    limpiar(){
        this.usuario=new UsuarioModel(null,null,null,null,null,null,null,null,null,null,null,null,null)
    }
    mostraralmacen(){
        let i=0;
        this._almacenesService.getAlmacenes().subscribe(
            result=>{
               this.almacenes=result;
               
               while(i<result.length){
                    this.nombres.push(result[i].nombre);
                    i=i+1;
               }
                console.log(this.nombres);
            },
            error=>{
                console.log(<any>error);
            }   
        );

    }
    modificar(){
        console.log(this.usuario);
        this.paswor =document.getElementById('pasword');
        this.confirmar =document.getElementById('confirmar');
       //console.log(this.input.value);
        if(this.paswor.value===this.confirmar.value){
            this._usuarioservice.updateusuarioclave(this.user.id,this.usuario).subscribe(
                result=>{
                    this.resultado=result;
                    console.log(this.resultado.code);
                    if(this.resultado.code==408)
                    {
                        this.canterror=this.canterror+1;
                        if(this.canterror==3)
                        {
                            this.authService.logout();
                        }else{
                            this.contradiferente();
                        }
                        this.limpiar();
                    }else{
                        console.log(result)
                        this.authService.logout();
                        this.correcto();
                    }
                    
                    
                },
                error=>{
                    console.log(<any>error);
                }
            );
        }else{
            this.nuevadifertente();
            this.limpiar();
        }
        
    }
    limitar(){
        this.paswor =document.getElementById('pasword');
        this.confirmar =document.getElementById('confirmar');
       //console.log(this.input.value);
        if(this.paswor.value===this.confirmar.value){
            this.confirmar.style="border: 0.3px solid #3bc1ff;";
        }else{
            this.confirmar.style="border: 0.3px solid red;";    
        }
    }
    contradiferente(){
        
         swal({
            title: 'contraseña incorecta',
            text:'tiene '+(3-this.canterror)+' oportunidades mas',
            timer: 5000,
        })
    }
    nuevadifertente(){
        swal({
        title: 'las contraseñas no coinciden',
        timer: 1000,
       })
    }
    correcto(){
        swal({
            title: 'se modifico con exito',
            timer: 1000,
        })
    }

}
