import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CantonRoutingModule } from './canton-routing.module';
import { CantonComponent } from './canton.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [CantonComponent],
  imports: [
    CommonModule,
    CantonRoutingModule,
    SharedModule
  ]
})
export class CantonModule { }
