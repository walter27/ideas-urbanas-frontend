import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VariableRoutingModule } from './variable-routing.module';
import { VariableComponent } from './variable.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [VariableComponent],
  imports: [
    CommonModule,
    VariableRoutingModule,
    SharedModule
  ]
})
export class VariableModule { }
