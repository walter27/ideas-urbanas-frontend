import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntermediateCitiesRoutingModule } from './intermediate-cities-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntermediateCitiesComponent } from './intermediate-cities.component';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';




@NgModule({
  declarations: [IntermediateCitiesComponent],
  imports: [
    CommonModule,
    IntermediateCitiesRoutingModule,
    SharedModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    MultiSelectModule
  ]
})

export class IntermediateCitiesModule { }
