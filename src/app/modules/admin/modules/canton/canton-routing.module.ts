import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CantonComponent } from './canton.component';


const routes: Routes = [
  {
    path: '',
    component: CantonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CantonRoutingModule { }
