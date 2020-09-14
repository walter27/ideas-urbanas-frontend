import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdesRoutingModule } from './ides-routing.module';
import { IdesComponent } from './ides.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [IdesComponent],
  imports: [
    CommonModule,
    IdesRoutingModule,
    TranslateModule
  ]
})
export class IdesModule { }
