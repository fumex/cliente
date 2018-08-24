import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS , HttpClientModule} from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { AplicationErrorHandle } from './app.error-handle';
import {AuthModule} from './auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { AuthGuard } from './guards/auth.guards';
import { AdminComponent } from './admin/admin.component';
import { AdminModule } from './admin/admin.module';
//import { CategoriaService} from './categorias/services/services.categoria';
//import { detalleimpuestoservice} from './detalle_impuesto/services/detalle_impuesto.service'
import { HttpModule}from '@angular/http';
import { ProveedorModule } from './proveedor/proveedor.module';
import { PagoModule } from './pago/pagos.module';
import {ProductoService} from'./productos/services/producto.service';
import { FormsModule } from '@angular/forms';
import { importType } from '@angular/compiler/src/output/output_ast';
import { ProductoModule } from './productos/productos.module';
import { InventarioModule } from './inventario/inventario.moule';
import { AlmacenesModule } from './Almacenes/almacenes.module';
import { AlmacenModule } from './almacen/almacen.module';
import { UsuariosModule }from './usuarios/usuarios.module';


import { detalleModule} from './detalle_impuesto/detalle.module'
import {OrdenDePedidoModule} from './orden-de-pedido/OrdenDePedido.module';

import { TipoDocumentoModule } from './TipoDocumento/documento.module';
import { ServiciosModule } from './pago-servicios/pago-servicios.module';
import { EmpleadoComponent } from './empleado/empleado.component';
import { EmpleadoModule } from './empleado/empleado.module';
import { SucursalModule } from './sucursales/sucursal.module';
import { ClienteModule } from './cliente/cliente.module';
import { EmpresaModule } from './empresa/empresa.module';
import { ImpuestoModule } from './impuesto/impuesto.module';
import { MonedaModule } from './moneda/moneda.module';
import { TipoPagoModule } from './tipo_pago/tipo_pago.module';


import { CajasModule} from './cajas/cajas.module';
import { VentasModule} from './ventas/ventas.module';
import { EmisorModule } from './emisor/emisor.module';


@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    //-----Menus---
    AdminModule,
    EmpleadoModule,
    //-------------
    ProveedorModule,
    PagoModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    ProductoModule,
    InventarioModule,
    AlmacenesModule,
    AlmacenModule,
    UsuariosModule,
    OrdenDePedidoModule,
    TipoDocumentoModule,
    ServiciosModule,
    SucursalModule,
    EmisorModule,
    //------------------------
    ClienteModule,
    EmpresaModule,
    ImpuestoModule,
    MonedaModule,

    detalleModule,

    TipoPagoModule,
    CajasModule,
    VentasModule,

  ],
  providers: [
    AuthGuard,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:TokenInterceptor,
      multi:true
    },{
      provide:HTTP_INTERCEPTORS,
      useClass:RefreshTokenInterceptor,
      multi:true
    },
    {
      provide:ErrorHandler,
      useClass:AplicationErrorHandle
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
