import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
//import { FullComponent } from './layouts/full/full.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryComponent } from './components/category/category.component';
import { ProductosComponent } from './components/productos/productos.component';
import { UserComponent } from './components/user/user.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { ClientComponent } from './components/client/client.component';
import { IncomeComponent } from './components/income/income.component';
import { OutcomeComponent } from './components/outcome/outcome.component';
import { OutcomeDetailComponent } from './components/outcome-detail/outcome-detail.component';
import { IncomeDetailComponent } from './components/income-detail/income-detail.component';
import { GraficComponent } from './grafic/grafic.component';
import { KardexComponent } from './components/kardex/kardex.component';
import { ServiciotecnicoComponent } from './components/serviciotecnico/serviciotecnico.component';
import { TypeComponent } from './components/type/type.component';
import { LocationComponent } from './components/location/location.component';

import { OutcomeDetail2Component } from './components/outcome-detail2/outcome-detail2.component';
import { IncomeDetail2Component } from './components/income-detail2/income-detail2.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'dashboard/usuarios', component: UserComponent },
  { path: 'dashboard/categorias', component: CategoryComponent },
  { path: 'dashboard/productos', component: ProductosComponent },
  { path: 'dashboard/proveedores', component: ProveedoresComponent },
  { path: 'dashboard/clientes', component: ClientComponent},
  { path: 'dashboard/entradas', component: IncomeComponent},
  { path: 'dashboard/salidas', component: OutcomeComponent},
  { path: 'dashboard/salidasDetalle', component: OutcomeDetailComponent},
  { path: 'dashboard/entradasDetalle', component: IncomeDetailComponent},
  { path: 'dashboard/Graficos', component: GraficComponent},
  { path: 'dashboard/kardex', component: KardexComponent},
  { path: 'dashboard/servicio', component: ServiciotecnicoComponent},
  { path: 'dashboard/tipos', component: TypeComponent},
  { path: 'dashboard/locaciones', component: LocationComponent},


  
  { path: 'dashboard/salidasDetalle2', component: OutcomeDetail2Component},
  { path: 'dashboard/entradasDetalle2', component: IncomeDetail2Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
