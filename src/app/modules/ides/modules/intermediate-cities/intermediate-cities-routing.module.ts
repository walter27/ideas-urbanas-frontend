import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { IntermediateCitiesComponent } from './intermediate-cities.component';


const routes: Routes = [
    { path: '', component: IntermediateCitiesComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IntermediateCitiesRoutingModule { }
