import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user.model';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginComponent} from '../login/login.component';
import { UsuarioService} from '../../usuarios/services/usuarios.service';
import { UsuarioModel} from '../../usuarios/modelos/usuarios'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user:User;
  public login:LoginComponent;
  public url;

  public ususario:UsuarioModel;
  public filesToUpload:File[];
  public text;
  public image:string=null;
  public mostarimg=null;
  public ruta;
  public filear;
  public res:any;
  imageUrl: string = "assets/images/1.png";
  fileToUpload:File = null;
  constructor(
    private authService:AuthService,
    private _users:UsuarioService
  ) { 
    this.user=this.authService.getUser();
    this.url=environment.api_url; 
    this.imageUrl=this.url+'/imagenes/2.png';
    this.filesToUpload=null;
    this.ususario=new UsuarioModel(null,null,null,null,null,null,null,null,null,null,null,null,null,null);
  }

  ngOnInit() {
    this.user;
    this.getdatosusuario();
    
  }
  getdatosusuario(){
    this._users.getusuario(this.user.id).subscribe(
      res=>{
        this.ususario=res;
        console.log(res);
        this.imageUrl=this.url+'/imagenes/'+this.ususario.imagen;
      },
      error=>{
        console.log(<any>error)
      }
    );
  }
  verfile(file: FileList,fileInput: any){

    this.filear=document.getElementById('image');
    
    var filePath = this.filear.value;

    var allowedExtensions = /(.jpg|.jpeg|.png)$/i;
   
    if(!this.filear.value){
        console.log('nada');
        this.filesToUpload=null;
    }else{
        if(file[0].size> 2000000){
            console.log('muy granmde');
            this.filesToUpload=null;
            this.filear.value="";
        }else{
            if(!allowedExtensions.exec(filePath)){
                console.log('no entro')
                this.filesToUpload=null;
                this.filear.value="";
                return false;
            }else{
                console.log('entro');
                this.filesToUpload = fileInput.target.files;
                this.fileToUpload = file.item(0);
                var reader = new FileReader();
                reader.onload = (event:any) => {
                  this.image=this.imageUrl;
                  this.imageUrl = event.target.result;
                }

                reader.readAsDataURL(this.fileToUpload);
            }
        }
    }
  }
  isertarimagen(dni){
    dni=this.ususario.numero_documento;
    if(this.filesToUpload==null){
      
    }else{

        this._users.insertariamgen(this.filesToUpload,dni).subscribe(
            respuesta=>{
                this.res=respuesta;
                
                console.log(this.res);
                if(this.res.code==200){
                  
                  this.filesToUpload=null;
                  this.ususario.imagen=this.res.name+this.ususario.numero_documento+'.'+this.res.extencion;
                  console.log(this.ususario);
                  this.modificarimagen();
                  
                  //this.imageUrl=this.url+'/imagenes/'+this.ususario.imagen;
                }
            },
            error=>{
                console.log(<any>error);
            }
        );  
    }  
  }
  modificarimagen(){
    
    this._users.updateimagen(this.user.id,this.ususario).subscribe(
      res=>{
        this.res=res;
        console.log(res)
        if(this.res.code==200){
          this.getdatosusuario();
        }
      },
      err=>{
        console.log(<any>err)
      }
    );
  }
  cancelar(){
    this.getdatosusuario();

    this.filesToUpload=null;
  }
}
