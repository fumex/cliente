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
import { CategoriaService} from './categorias/services/services.categoria';
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

import {OrdenDePedidoModule} from './orden-de-pedido/OrdenDePedido.module';

import { TipoDocumentoModule } from './TipoDocumento/documento.module';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    AdminModule,
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
    
    TipoDocumentoModule
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
