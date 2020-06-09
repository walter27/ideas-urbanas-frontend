import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitizenReportsRoutingModule } from './citizen-reports-routing.module';
import { CitizenReportsComponent } from './citizen-reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IconsModule } from 'src/app/icons/icons.module';


@NgModule({
  declarations: [CitizenReportsComponent],
  imports: [
    CommonModule,
    CitizenReportsRoutingModule,
    SharedModule,
    IconsModule
  ]
})
export class CitizenReportsModule { }
