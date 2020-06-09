import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThematicRoutingModule } from './thematic-routing.module';
import { ThematicComponent } from './thematic.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ThematicComponent],
  imports: [
    CommonModule,
    ThematicRoutingModule,
    SharedModule
  ]
})
export class ThematicModule { }
