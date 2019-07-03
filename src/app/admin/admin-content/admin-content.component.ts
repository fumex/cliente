/*esta es la pagina de inicio en aca estan los graficos ,para los graficos usamos una libreria chartjs ,en su pagina web
 https://www.chartjs.org/samples/latest/   */
import { Component, OnInit,Input } from '@angular/core';
import { environment } from "../../../environments/environment";
import { UsuarioService } from "../../usuarios/services/usuarios.service";
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/interfaces/user.model';
import { PermisosRolesModel } from "../../usuarios/modelos/permisos_roles";
import { AlmacenesService } from '../../Almacenes/services/almacenes.service';
import { VentasService } from '../../ventas/services/Ventas.service';
import { SucursalService } from '../../sucursales/services/sucursal.service';
import { AlmaceneService } from '../../almacen/services/almacen.services';
import { ChartType, ChartOptions } from 'chart.js';


@Component({
  selector: 'app-admin-content',
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.css'],
  providers:[UsuarioService]
})
export class AdminContentComponent implements OnInit {
    public pieChartOptions: ChartOptions = {
      responsive: true,
      legend: {
        position: 'left',
      },
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            const label = ctx.chart.data.labels[ctx.dataIndex];
            return label;
          },
        },
      }
    };
  @Input('chartLabels') doughnutChartLabels:string[] = [];
  @Input('chartData') doughnutChartData:number[] = [];
  @Input('chartType') doughnutChartType:string = 'pie';
  @Input('chartType') pieChartColors = [
    {
      backgroundColor: [],
    },
  ]
  
  public verie=null;
  public verline=null;
  public url;
  public user:User;
  public verreporte=null;
  public mandar:PermisosRolesModel;
  public almacenescantidad=null;
  public ventasdeldia=0;
  public cantidadvendido=0;
  public usuarioscantidad=null;
  public sucursales:any[];
  public ventas:Array<any>=[];
  public productos:Array<any>=[];
  public meses:string[]=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre']

  
  public lineChartData: any[] = [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Oreo' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Madera' },
    ];
    public lineChartLabels: string[] = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];
    public lineChartOptions: (ChartOptions & { annotation: any }) = {
      responsive: true,
      scales: {
        // We use this empty structure as a placeholder for dynamic theming.
        xAxes: [{}],
        yAxes: [
          {
            id: 'y-axis-0',
            position: 'left',
          },
          {
            id: 'y-axis-1',
            position: 'right',
            gridLines: {
              color: 'rgba(255,0,0,0.3)',
            },
            ticks: {
              fontColor: 'red',
            }
          }
        ]
      },
      annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: 'March',
            borderColor: 'orange',
            borderWidth: 2,
            label: {
              enabled: true,
              fontColor: 'orange',
              content: 'LineAnno'
            }
          },
        ],
      },
    };
    public lineChartColors = [
      { // grey
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      },
      { // red
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      }
    ];
    public lineChartLegend = true;
    public lineChartType = 'line';
  constructor(
    private _UsuarioService:UsuarioService,
    private auth:AuthService,
    private _almacenesservice:AlmacenesService,
    private _VentasService:VentasService,
    private sucursalService:SucursalService,
    private _almacenService:AlmaceneService,
  ) { 
    this.url=environment.url+'admin/';
    this.user=this.auth.getUser();
    this.mandar = new PermisosRolesModel(this.user.id,null,this.url,null,null);
    let i=0; 
    //esta parte es para los permisos ,para controlar que solo puedan ver lso graficos las personas designadas esta de esta misma manera en cada vista */
    
    this._UsuarioService.getpermisos(this.mandar).subscribe(
      res=>{
        console.log(res)
        if(res.mensaje==true){
          this.verreporte=true;
        }else{
          if(res.mensaje!=false){
            while(i<res.length){
              if(res[i].tipo_permiso=="reporte" && res[i].estado==true){
                this.verreporte=true;
              }
              i++
            }
  
          }
        }
        
        console.log(this.verreporte);
      },
      err=>{
        console.log(<any>err);
      }
    )
    this.traerproductos();
  }
//este componente inicia despues des contructor , usualmente aca se llaman a todfo el contenido de la base de datos
  ngOnInit() {
    /*casi todos los componentes siguen el mismo proceso por ejemplo esa funcion "traertodaslaventas" primero va a la funcion de 
    la funciopn va a la plantilla servise y en ahi conecta con una url echa en el api ,en php(lartavel), la cual va a otra funcion y retorna 
    la informacion */
      this.traertodaslasventas();
      this.traerdatostop();
      this.traerventashoy();
      this.traerusers();
      this.traersucursales();
      
  }
  graficoventasmese(){
    this.verline=1;
    let i =0,j=0,verificar=null;
    while(i<this.ventas.length){
      while(j<this.lineChartData.length){
          if(this.ventas[i].namecaja==this.lineChartData[j].label){
            verificar=j;
            break;
          }

        j++
      }
      if(verificar==null){
        this.lineChartData.push({data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0], label:this.ventas[i].namecaja })
      }else{

      }
      verificar=null
      j=0;
      i++
    }
  }
  traerproductos(){
    
    this._almacenService.getallproductos().subscribe(
        res=>{
            this.productos=res;
            console.log(this.productos);
            this.agreagarpie();
            
        },
        error=>{
            console.log(<any>error);
        }   
    );
  }
  agreagarpie(){
    this.verie=1;
    let i=0;
    let j=0;
    let verificar=null;
    console.log(this.productos)
    console.log(this.productos.length);
    let  r
    let  g
    let  b

    while(i<this.productos.length){
      while(j<this.doughnutChartLabels.length){
        if(this.productos[i].nombre_producto==this.doughnutChartLabels[j]){
          verificar=j;
          break;
        }
        j++
      }
      if(verificar==null){
        this.doughnutChartLabels.push(this.productos[i].nombre_producto)
        this.doughnutChartData.push(parseInt(this.productos[i].stock));
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        b = Math.floor(Math.random() * 255);
        this.pieChartColors[0].backgroundColor.push("rgb(" + r + "," + g + "," + b + ")");
      }else{
        this.doughnutChartData[verificar]+=parseInt(this.productos[i].stock);
      }
        verificar=null;
        j=0;
        i++;
    }
    console.log(this.doughnutChartData);
    console.log(this.doughnutChartLabels);
  }
  traerdatostop(){
    this._almacenesservice.mostraalmacenusuario(this.user.id).subscribe(
        result=>{
            this.almacenescantidad=result.length;
            console.log(result);
        },
        error=>{
            console.log(<any>error);
        }   
    );
  }
  //trae todas las ventas
  traertodaslasventas(){
    this._VentasService.getventastotales().subscribe(
      res=>{
        this.ventas=res;
        console.log(res);
      },
      err=>{
        console.log(<any>err);
      }
    )
  }
  traerventashoy(){
    let i=0;
    this._VentasService.getventashoy().subscribe(
      res=>{
        console.log(res);
        this.ventasdeldia=res.length;
        while(i<res.length){
          this.cantidadvendido+=res[i].total*1;
          i++;
        }
        
      },
      err=>{
        console.log(<any>err);
      }
    )
  }
  traerusers(){
    this._UsuarioService.usuarios().subscribe(
        response=>{
          this.usuarioscantidad=response.length
        },
        error=>{
            console.log(<any>error);
        }
    );
  }
  traersucursales(){
    this.sucursalService.listSucursales().subscribe(
        result=>{
            this.sucursales=result;
        },
        error=>{
            console.log(<any>error);
        }
    );
  }
  verdatosproducto(e:any): void{

    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
        if ( activePoints.length > 0) {
          // get the internal index of slice in pie chart
          const clickedElementIndex = activePoints[0]._index;
          const label = chart.data.labels[clickedElementIndex];
          // get value by index
          const value = chart.data.datasets[0].data[clickedElementIndex];
          console.log(clickedElementIndex, label, value)
        }
       }
  }
}
