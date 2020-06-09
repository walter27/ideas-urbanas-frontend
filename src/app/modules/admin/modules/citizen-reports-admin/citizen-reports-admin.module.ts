import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitizenReportsAdminRoutingModule } from './citizen-reports-admin-routing.module';
import { CitizenReportsAdminComponent } from './citizen-reports-admin.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [CitizenReportsAdminComponent],
  imports: [
    CommonModule,
    CitizenReportsAdminRoutingModule,
    SharedModule
  ]
})
export class CitizenReportsAdminModule { }
