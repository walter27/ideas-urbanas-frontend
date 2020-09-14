import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    AboutRoutingModule,
    AngularSvgIconModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,

  ]
})
export class AboutModule { }
