import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CovidRoutingModule } from './covid-routing.module';
import { CovidComponent } from './covid.component';
import { SharedModule } from '../../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [CovidComponent],
  imports: [
    CommonModule,
    CovidRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class CovidModule { }
