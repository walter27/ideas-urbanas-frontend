import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OriginComponent } from './origin.component';


const routes: Routes = [
  {
    path: '',
    component: OriginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OriginRoutingModule { }
