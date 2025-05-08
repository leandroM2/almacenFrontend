import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {DataTablesModule} from 'angular-datatables'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material-module';
import { HomeComponent } from './home/home.component';
import { BestSellerComponent } from './best-seller/best-seller.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from './shared/shared.module';
import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { LoginComponent } from './components/login/login.component';
import { ProductosComponent } from './components/productos/productos.component';
import { CategoryComponent } from './components/category/category.component';
import { TypeComponent } from './components/type/type.component';
import { LocationComponent } from './components/location/location.component';
import { AuthInterceptor } from './authInterceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './components/user/user.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { ClientComponent } from './components/client/client.component';
import { IncomeComponent } from './components/income/income.component';
import { OutcomeComponent } from './components/outcome/outcome.component';
import { OutcomeDetailComponent } from './components/outcome-detail/outcome-detail.component';
import { IncomeDetailComponent } from './components/income-detail/income-detail.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GraficComponent } from './grafic/grafic.component';
import { KardexComponent } from './components/kardex/kardex.component';
import { ServiciotecnicoComponent } from './components/serviciotecnico/serviciotecnico.component';

import { OutcomeDetail2Component } from './components/outcome-detail2/outcome-detail2.component';
import { IncomeDetail2Component } from './components/income-detail2/income-detail2.component';

@NgModule({
  declarations: [	
    AppComponent,
    HomeComponent,
    BestSellerComponent,
    FullComponent,
    AppHeaderComponent,
    AppSidebarComponent,
    IniciarSesionComponent,
    LoginComponent,
    ProductosComponent,
    CategoryComponent,
    TypeComponent,
    LocationComponent,
    DashboardComponent,
    UserComponent,
    ProveedoresComponent,
    ClientComponent,
    IncomeComponent,
    OutcomeComponent,
    OutcomeDetailComponent,
    IncomeDetailComponent,
    GraficComponent,
    KardexComponent,
    ServiciotecnicoComponent,

    OutcomeDetail2Component,
    IncomeDetail2Component,

   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    SharedModule,
    HttpClientModule,
    NgxChartsModule,
    DataTablesModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
