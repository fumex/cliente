import { Component, OnInit } from '@angular/core';
import { environment } from "../../../environments/environment";
import { UsuarioService } from "../../usuarios/services/usuarios.service";
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/interfaces/user.model';
import { PermisosRolesModel } from "../../usuarios/modelos/permisos_roles";

@Component({
  selector: 'app-admin-content',
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.css'],
  providers:[UsuarioService]
})
export class AdminContentComponent implements OnInit {

  graficos: any;
  public url;
  public user:User;
  public verreporte=null;
  public mandar:PermisosRolesModel;
  constructor(
    private _UsuarioService:UsuarioService,
    private auth:AuthService,
  ) { 
    this.url=environment.url+'admin/';
    this.user=this.auth.getUser();
    this.mandar = new PermisosRolesModel(this.user.id,null,this.url,null,null);
    let i=0; 
    this._UsuarioService.getpermisos(this.mandar).subscribe(
      res=>{
        console.log(res)
        if(res!="false"){
          while(i<res.length){
            if(res[i].tipo_permiso=="reportes" && res[0].estado==true){
              this.verreporte=true;
            }
            i++
          }

        } 
        console.log(this.verreporte);
      },
      err=>{
        console.log(<any>err);
      }
    )
    
  }

  ngOnInit() {
      this.graficos = {
        'grafico1': {
          'labels': ['Con Frijoles', 'Con Natilla', 'Con tocino'],
          'data':  [24, 30, 46],
          'type': 'doughnut',
          'leyenda': 'El pan se come con'
        },
        'grafico2': {
          'labels': ['Hombres', 'Mujeres'],
          'data':  [4500, 6000],
          'type': 'doughnut',
          'leyenda': 'Entrevistados'
        },
        'grafico3': {
          'labels': ['Si', 'No'],
          'data':  [95, 5],
          'type': 'doughnut',
          'leyenda': '¿Le dan gases los frijoles?'
        },
        'grafico4': {
          'labels': ['No', 'Si'],
          'data':  [85, 15],
          'type': 'doughnut',
          'leyenda': '¿Le importa que le den gases?'
        },
      };
  }

}
