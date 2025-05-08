import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { CategoryComponent } from '../components/category/category.component';
import { TypeComponent } from '../components/type/type.component';
import { LocationComponent } from '../components/location/location.component';
import { ProductosComponent } from '../components/productos/productos.component';


export const DashboardRoutes: Routes = [
  {path: '', component: DashboardComponent},
  { path: 'category', component: CategoryComponent },
  { path: 'type', component: TypeComponent },
  { path: 'location', component: LocationComponent },
  { path: 'productos', component: ProductosComponent },
];
