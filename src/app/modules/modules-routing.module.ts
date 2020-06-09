import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModulesComponent } from './modules.component';
import { AuthGuardService } from '../core/guards/auth-guard-admin.service';


const routes: Routes = [
  {
    path: '',
    component: ModulesComponent,
    loadChildren: './ides/ides.module#IdesModule'
  },
  {
    path: 'auth',
    component: ModulesComponent,
    loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: 'admin',
    component: ModulesComponent,
    loadChildren: './admin/admin.module#AdminModule',
    canActivateChild: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
