import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClasificationComponent } from './clasification.component';


const routes: Routes = [
  {
    path: '',
    component: ClasificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClasificationRoutingModule { }
