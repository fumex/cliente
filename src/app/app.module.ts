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
import { ProductosComponent } from './productos/componentes/productos.component';
import { ProductosAddComponent } from './productos/componentes/producto-add.components';
import {ProductoService} from'./productos/services/producto.service';
import{CategoriaService} from './categorias/services/services.categoria';
import{HttpModule}from '@angular/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ProductosComponent,
    ProductosAddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    AdminModule,
    HttpModule,
    FormsModule,
    HttpClientModule
    
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
