import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CovidRoutingModule } from './covid-routing.module';
import { CovidComponent } from './covid.component';
import { SharedModule } from '../../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ChartModule } from 'primeng/chart';
import { HighchartsChartModule } from 'highcharts-angular';
import { MultiSelectModule } from 'primeng/multiselect';





@NgModule({
  declarations: [CovidComponent],
  imports: [
    CommonModule,
    CovidRoutingModule,
    SharedModule,
    TranslateModule,
    ChartModule,
    HighchartsChartModule,
    MultiSelectModule

  ]
})
export class CovidModule { }
