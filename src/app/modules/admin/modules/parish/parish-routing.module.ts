import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParishComponent } from './parish.component';


const routes: Routes = [
  {
    path: '',
    component: ParishComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParishRoutingModule { }
