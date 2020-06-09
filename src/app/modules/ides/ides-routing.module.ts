import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home'
  },
  {
    path: 'cities',
    loadChildren: './modules/cities/cities.module#CitiesModule'
  },
  {
    path: 'home',
    loadChildren: './modules/home/home.module#HomeModule'
  },
  {
    path: 'thematic',
    loadChildren: './modules/thematic/thematic.module#ThematicModule'
  },
  {
    path: 'citizen-reports',
    loadChildren: './modules/citizen-reports/citizen-reports.module#CitizenReportsModule'
  },
  {
    path: 'indexes',
    loadChildren: './modules/indexes/indexes.module#IndexesModule'
  },
  {
    path: 'covid',
    loadChildren: './modules/covid/covid.module#CovidModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdesRoutingModule { }
