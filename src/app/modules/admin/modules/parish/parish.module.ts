import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParishRoutingModule } from './parish-routing.module';
import { ParishComponent } from './parish.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ParishComponent],
  imports: [
    CommonModule,
    ParishRoutingModule,
    SharedModule
  ]
})
export class ParishModule { }
