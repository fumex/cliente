import {Injectable} from'@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable}from'rxjs/Observable';
import {producto}from '../modelos/productos';

@Injectable()
export class ProductoService{
    public url:string;
    constructor(
        public _http:HttpClient
    ){
     this.url=environment.api_url;   
    }

    getProductos(){
        return this._http.get<any>(this.url+'/productos').shareReplay();
    }
    addproducto(producto:producto):Observable<any>{
        let json = JSON.stringify(producto);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/productos',params,{headers:headers});
            
    }
    SeleccionarProducto(id){
        return this._http.get<any>(this.url+'/productos/'+id).shareReplay();
    }

    borrarproducto(id){
        return this._http.get<any>(this.url+'/productos/eliminar/'+id).shareReplay();
    }
    Productosupdate(id,producto:producto):Observable<any>{
        let json = JSON.stringify(producto);
        
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
        return this._http.post(this.url+'/productos/'+id,params,{headers:headers});
    }

    listProductos(){
        return this._http.get<any>(this.url+'/productos-get').shareReplay();
    }
    insertariamgen( listas: Array<File>){
        if(listas.length>0){
            let file:File=listas[0];
            let formdata:FormData=new FormData();
            
            formdata.append('photo',file,file.name);
            
            let headers = new HttpHeaders();
            headers.append('Content-Type', 'application/json');
            //let options = new RequestOptions({ headers: headers });
            return this._http.post(this.url+'/imagenesproductos', formdata,{headers:headers} ).shareReplay();
            
        }
    }
    mostaraimagen(name){
        return this._http.get<any>(this.url+'/imagenesproductos/'+name).shareReplay();
    }
    //-------------------------Detalle Producto------------------------------------------------------------------
    listDetalleProducto(id):Observable<any>{
        return this._http.get(this.url+'/auth/producto-detalle/'+id).shareReplay();
    }
}