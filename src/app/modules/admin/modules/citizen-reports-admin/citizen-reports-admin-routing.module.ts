import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitizenReportsAdminComponent } from './citizen-reports-admin.component';


const routes: Routes = [
  {
    path: '',
    component: CitizenReportsAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitizenReportsAdminRoutingModule { }
