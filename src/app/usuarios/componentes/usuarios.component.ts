import { Component } from "@angular/core";
import { UsuarioService } from "../../usuarios/services/usuarios.service";
import { UsuarioModel } from '../../usuarios/modelos/usuarios';

@Component({
    selector:'add-usuario',
    templateUrl:'../views/usuarios.component.html',
    providers:[UsuarioService]
})
export class usuarioscomponent{
    public paswor;
    public confirmar;
    public usuario:UsuarioModel;
    public usuarioarreglo:Array<UsuarioModel>=[];
    public titulo;
    public compara;
    constructor(
        private _UsuarioService:UsuarioService,
    ){
        this.usuario = new UsuarioModel(null,'','',null,null,'',null,'','','','','');
        this.titulo="categoria"
        this.paswor=null;
        this.confirmar=null;
        this.compara=0;
    }
    alimantarareglo(){
        this.usuarioarreglo.push(this.usuario);
        console.log(this.usuarioarreglo);
    }
    guardarusuario(){
        //this.categoria = new categoria(tipo1);
        console.log(this.usuario);
        this._UsuarioService.addusuario(this.usuario).subscribe(
            response=>{
                console.log(response);
                this.usuario = new UsuarioModel(null,'','',0,0,'',0,'','','','','');
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    limitar(){
        this.paswor =document.getElementById('pasword');
        this.confirmar =document.getElementById('confirmar');
       //console.log(this.input.value);
        if(this.paswor.value===this.confirmar.value){
            console.log('iguales'+this.compara);
            this.confirmar.style="border: 0.3px solid #3bc1ff;";
           this.compara=1;
        }else{
            this.compara=0
            
            this.confirmar.style="border: 0.3px solid red;";
            console.log('diferentes'+this.compara);
        }
       /*if(numero>stock)
       {
           this.input.value = stock-1;
           this.input.style="border: 0.3px solid red;";
          this.alerta();  
           console.log("se paso");
         
       }else{
           console.log(numero,stock);
           this.input.style="border: 0.3px solid #3bc1ff;";
       }*/
      
      
   }
}