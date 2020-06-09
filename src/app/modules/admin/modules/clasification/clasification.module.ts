import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClasificationRoutingModule } from './clasification-routing.module';
import { ClasificationComponent } from './clasification.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ClasificationComponent],
  imports: [
    CommonModule,
    ClasificationRoutingModule,
    SharedModule
  ]
})
export class ClasificationModule { }
