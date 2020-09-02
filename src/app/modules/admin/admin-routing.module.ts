import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: AdminComponent,
    loadChildren: './modules/users/users.module#UsersModule'
  },
  {
    path: 'config',
    component: AdminComponent,
    loadChildren: './modules/config/config.module#ConfigModule'
  },
  {
    path: 'province',
    component: AdminComponent,
    loadChildren: './modules/province/province.module#ProvinceModule'
  },
  {
    path: 'canton',
    component: AdminComponent,
    loadChildren: './modules/canton/canton.module#CantonModule'
  },
  /* {
    path: 'parish',
    loadChildren: './modules/parish/parish.module#ParishModule'
  }, */
  {
    path: 'research',
    component: AdminComponent,
    loadChildren: './modules/research/research.module#ResearchModule'
  },
  {
    path: 'origin',
    component: AdminComponent,
    loadChildren: './modules/origin/origin.module#OriginModule'
  },
  {
    path: 'clasification',
    component: AdminComponent,
    loadChildren: './modules/clasification/clasification.module#ClasificationModule'
  },
  {
    path: 'variable',
    component: AdminComponent,
    loadChildren: './modules/variable/variable.module#VariableModule'
  },
  {
    path: 'data',
    component: AdminComponent,
    loadChildren: './modules/data/data.module#DataModule'
  },
  {
    path: 'citizen-reports',
    component: AdminComponent,
    loadChildren: './modules/citizen-reports-admin/citizen-reports-admin.module#CitizenReportsAdminModule'
  },
  {
    path: 'indicator',
    component: AdminComponent,
    loadChildren: './modules/indicator/indicator.module#IndicatorModule'
  },
  {
    path: 'tag',
    component: AdminComponent,
    loadChildren: './modules/tag/tag.module#TagModule'
  },
  {
    path: 'stop',
    component: AdminComponent,
    loadChildren: './modules/stop/stop.module#StopModule'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
