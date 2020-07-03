import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CovidRoutingModule } from './covid-routing.module';
import { CovidComponent } from './covid.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ChartModule } from 'primeng/chart';
import { HighchartsChartModule } from 'highcharts-angular';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { Ng5SliderModule } from 'ng5-slider';
import { DropdownModule } from 'primeng/dropdown';








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
    SliderModule,
    Ng5SliderModule,
    DropdownModule

  ]
})
export class CovidModule { }
