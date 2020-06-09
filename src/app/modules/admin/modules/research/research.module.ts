import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResearchRoutingModule } from './research-routing.module';
import { ResearchComponent } from './research.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ResearchComponent],
  imports: [
    CommonModule,
    ResearchRoutingModule,
    SharedModule
  ]
})
export class ResearchModule { }
