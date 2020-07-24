import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitiesRoutingModule } from './cities-routing.module';
import { CitiesComponent } from './cities.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IconsModule } from 'src/app/icons/icons.module';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';





@NgModule({
  declarations: [CitiesComponent],
  imports: [
    CommonModule,
    CitiesRoutingModule,
    SharedModule,
    IconsModule,
    TagCloudModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    ButtonModule
  ]
})
export class CitiesModule { }
