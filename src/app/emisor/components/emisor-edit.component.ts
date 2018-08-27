import { Component } from '@angular/core';
import { EmisorService } from '../services/emisor.service';

@Component({
    selector:'emisor-edit',
    templateUrl:'../views/emisor-add.html',
    providers:[EmisorService]
})
export class EmisorEditComponent{

}