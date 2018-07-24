import { Component, OnInit,  ViewContainerRef } from '@angular/core';
import { PagoService } from '../services/pago.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../auth/interfaces/user.model';
import { AuthService } from '../../auth/services/auth.service';
import { ToastService } from '../../toastalert/service/toasts.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PagoAnulaModel } from '../models/pago-anular';

declare var jQuery:any;
declare var $:any;
@Component({
    selector:'pago-list',
    templateUrl:'../views/pago-list.html',
    providers:[PagoService, ToastService]
})
export class PagoListComponent implements OnInit{

    //-------------------------------
    public code:string;
    public nombre_proveedor:string;
    public documento:string;
    public nroBoleta:string;
    public almacen:string;
    public tipoPago:string;
    public subtotal:number;
    public igv:number;
    public fecha:string;
    //-------------------------------
    public title:string;
    public pagos:any=[];

    public confirmado;
    public user:User;
    public cadena;
    public pago:PagoAnulaModel;
    constructor(
        private pagoService:PagoService,
        private route:ActivatedRoute,
        private router:Router,
        private auth:AuthService,
        private toaste:ToastService,
        private toastr:ToastsManager,
        vcr:ViewContainerRef
    ){
        this.toastr.setRootViewContainerRef(vcr);
        this.user=this.auth.getUser();
        this.title='Lista de Compras';
        this.tabla();
        this.cadena=[
            { name: 'Bartek', age: 34 },
            { name: 'John', age: 27 },
            { name: 'Elizabeth', age: 30 },
          ];
    }
    ngOnInit(){
        this.getPagos();
    }
    tabla(){
        setTimeout(function(){
            $(function(){
                 $('#pago').DataTable({
                    
                     dom: 'Bfrtip',
                     buttons: [
                         'copy', 'csv', 'excel', 'pdf', 'print'
                     ]
                 });
            });
        },5000);
    }
    getPagos(){
         this.pagoService.listPago(this.user.id).subscribe(
             result=>{
                this.pagos=result;
             },
             error=>{
                console.log(<any>error);
                let text="Error de conexion";
                this.toaste.errorAlerta(text,'Error!');
             }
         );
    }
    agregar(){
        this.router.navigate(['/'+this.user.rol+'/transaccion']);
    }

    public buildTable(data,columns){
        var body = [];

        body.push(columns);

        data.forEach(function(row) {
            var dataRow = [];

            columns.forEach(function(column) {
                dataRow.push(row[column].toString());
            })

            body.push(dataRow);
        });

        return body;
    }

      public table(data, columns) {
        return {
          layout: 'lightHorizontalLines',
            table: {
                headerRows: 1,
                body: this.buildTable(data, columns)
            }
        };
    }
    download(){
        pdfMake.vfs=pdfFonts.pdfMake.vfs;
        var dd = {
            footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
            header: function(currentPage, pageCount, pageSize) {
            // you can apply any logic and return any valid pdfmake element
    
                return [
                    { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' },
                    { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
                ]
          },
          content: [
            //{text :  'Sistema de ventas' , fontSize :  15,style:'header' },
            // { text: 'Another text', style: 'anotherStyle' },
            { text: this.nombre_proveedor, style: 'header' },
            // margin: [left, top, right, bottom]
            { text: 'sample', margin: [ 5, 2, 10, 20 ] },
    
            // margin: [horizontal, vertical]
            { text: 'another text', margin: [5, 2] },
            { text: 'another text', margin: [5, 2] },
            // margin: equalLeftTopRightBottom
            { text: 'last one', margin: 5 },
            this.table(this.cadena, ['name', 'age']),
          ],
          styles: {
            header: {
              fontSize: 22,
              bold: true
            },
            anotherStyle: {
              italics: true,
              alignment: 'right'
            }
          }
      }
        pdfMake.createPdf(dd).download('pdfSis.pdf');
    }
    
    public recibo(id,code,nom_prove,docume,nroBoleta,almacen,tipoPago,subtotal,igv,fecha){
        this.pago= new PagoAnulaModel(id,code,nom_prove,docume,nroBoleta,almacen,tipoPago,subtotal,igv,fecha);
        this.asignar(this.pago);
        this.detalle();
        this.download();
    }
    public detalle(){
        this.pagoService.listDetallePago(this.code).subscribe(
            result=>{
                console.log(result)
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
    public asignar(pago:PagoAnulaModel){
        this.code=pago.code;
        this.nombre_proveedor=pago.nombre_proveedor;
        this.documento=pago.documento;
        this.nroBoleta=pago.nroBoleta;
        this.almacen=pago.almacen;
        this.tipoPago=pago.tipoPago;
        this.subtotal=pago.subtotal;
        this.igv=pago.igv;
        this.fecha=pago.created_at;
    }
}