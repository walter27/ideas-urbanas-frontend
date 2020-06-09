import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitizenReportsComponent } from './citizen-reports.component';


const routes: Routes = [
  {
    path: '',
    component: CitizenReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitizenReportsRoutingModule { }
