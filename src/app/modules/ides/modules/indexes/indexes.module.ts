import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexesRoutingModule } from './indexes-routing.module';
import { IndexesComponent } from './indexes.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Ng5SliderModule } from 'ng5-slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';





@NgModule({
  declarations: [IndexesComponent],
  imports: [
    CommonModule,
    IndexesRoutingModule,
    SharedModule,
    Ng5SliderModule,
    MultiSelectModule,
    FormsModule
  ]
})
export class IndexesModule { }
