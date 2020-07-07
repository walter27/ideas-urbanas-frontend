import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulesComponent } from './modules.component';
import { ModulesRoutingModule } from './modules-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AgWordCloudModule } from 'angular4-word-cloud';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [ModulesComponent],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    SharedModule,
    NgxSpinnerModule,
    AgWordCloudModule,
    FormsModule,
    ReactiveFormsModule,
    //BrowserAnimationsModule
  ]
})
export class ModulesModule { }
