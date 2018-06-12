import { Component, OnInit } from "@angular/core";
import { SucursalService } from "../services/sucursal.service";
import { SucursalModel } from "../modelos/sucursal";
import { User } from "../../auth/interfaces/user.model";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../auth/services/auth.service";

@Component({
    selector:'sucursal-add',
    templateUrl:'../views/sucursal-add.html',
    providers:[SucursalService]
})
export class SucursalAddComponent implements OnInit{
    public title:string;
    public sucursal:SucursalModel;
    public user:User;
    constructor(
        private sucursalService:SucursalService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService
    ){
        this.title="Agregar Sucursal";
        this.user=this.auth.getUser();
        this.sucursal=new SucursalModel(null,'',null,'','','',this.user.id);
    }
    ngOnInit(){

    }
    onSubmit(){
        this.sucursalService.addSucursal(this.sucursal).subscribe(
            result=>{
                console.log(result);
                this.list();
            },
            error=>{
                console.log(<any>error);
            }
        )
    }
    list(){
        this.router.navigate(['/'+this.user.rol+'/sucursal/list']);
    }
    onCancel(){
        this.sucursal= new SucursalModel(null,'',null,'','','',this.user.id);
    }
}