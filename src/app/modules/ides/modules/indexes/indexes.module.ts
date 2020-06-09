import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexesRoutingModule } from './indexes-routing.module';
import { IndexesComponent } from './indexes.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [IndexesComponent],
  imports: [
    CommonModule,
    IndexesRoutingModule,
    SharedModule
  ]
})
export class IndexesModule { }
