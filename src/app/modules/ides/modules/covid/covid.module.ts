import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CovidRoutingModule } from './covid-routing.module';
import { CovidComponent } from './covid.component';
import { SharedModule } from '../../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ChartModule } from 'primeng/chart';
import { HighchartsChartModule } from 'highcharts-angular';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';

import { Ng5SliderModule } from 'ng5-slider';







@NgModule({
  declarations: [CovidComponent],
  imports: [
    CommonModule,
    CovidRoutingModule,
    SharedModule,
    TranslateModule,
    ChartModule,
    HighchartsChartModule,
    MultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    SliderModule,
    Ng5SliderModule

  ]
})
export class CovidModule { }
