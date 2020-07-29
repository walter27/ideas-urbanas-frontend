import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdesRoutingModule } from './ides-routing.module';
import { IdesComponent } from './ides.component';

@NgModule({
  declarations: [IdesComponent],
  imports: [
    CommonModule,
    IdesRoutingModule
  ]
})
export class IdesModule { }
