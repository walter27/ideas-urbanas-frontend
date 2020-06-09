import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { TagCloudModule } from 'angular-tag-cloud-module';
import {FormsModule} from '@angular/forms';
import { IconsModule } from 'src/app/icons/icons.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    TagCloudModule,
    FormsModule,
    IconsModule,
    TranslateModule
  ]
})
export class HomeModule { }
