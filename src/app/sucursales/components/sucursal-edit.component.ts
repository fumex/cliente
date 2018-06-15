import { Component, OnInit } from "@angular/core";
import { SucursalService } from "../services/sucursal.service";

@Component({
    selector:'sucursal-edit',
    templateUrl:'../views/sucursal-add.html', //reutilizar
    providers:[SucursalService]
})
export class SucursalEditComponent implements OnInit{
    
    constructor(){
        
    }
    ngOnInit(){

    }
}