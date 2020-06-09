import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OriginRoutingModule } from './origin-routing.module';
import { OriginComponent } from './origin.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [OriginComponent],
  imports: [
    CommonModule,
    OriginRoutingModule,
    SharedModule
  ]
})
export class OriginModule { }
