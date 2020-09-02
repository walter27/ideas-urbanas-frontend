import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StopComponent } from './stop.component';


const routes: Routes = [


  {
    path: '',
    component: StopComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StopRoutingModule { }
