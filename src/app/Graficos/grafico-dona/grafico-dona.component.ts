import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector:'app-grafico-dona',
    templateUrl:'./grafico-dona.components.html',
    styles:[]
})
export class GraficoDonaComponnent implements OnInit{
    @Input('chartLabels') doughnutChartLabels:string[] = [];
    @Input('chartData') doughnutChartData:number[] = [];
    @Input('chartType') doughnutChartType:string = '';
    
    constructor(){
    }
    
    ngOnInit(){
    }
    ver(e:any): void{
       
    }
}