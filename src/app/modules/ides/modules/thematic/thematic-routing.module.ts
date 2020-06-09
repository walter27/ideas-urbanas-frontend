import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThematicComponent } from './thematic.component';


const routes: Routes = [
  {
    path: '',
    component: ThematicComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThematicRoutingModule { }
