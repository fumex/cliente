import { Component, OnInit } from "@angular/core";
import { SucursalService } from "../services/sucursal.service";

@Component({
    selector:'sucursal-list',
    templateUrl:'../views/sucursal-list.html',
    providers:[SucursalService]
})
export class SucursalListComponent implements OnInit{
    
    constructor(){
        
    }
    ngOnInit(){

    }
}