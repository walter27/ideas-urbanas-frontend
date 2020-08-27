import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StopRoutingModule } from './stop-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { StopComponent } from './stop.component';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {PaginatorModule} from 'primeng/paginator';
import { FeatherModule } from 'angular-feather';







@NgModule({
  declarations: [StopComponent],
  imports: [
    CommonModule,
    StopRoutingModule,
    SharedModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    PaginatorModule,
    FeatherModule
  ],
  bootstrap: [StopComponent],

})
export class StopModule { }
