import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { FormsModule } from '@angular/forms';
import { IconsModule } from 'src/app/icons/icons.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxTweetModule } from 'ngx-tweet';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { NgxTwitterTimelineModule } from 'ngx-twitter-timeline';
import { DialogModule } from 'primeng/dialog';





@NgModule({
  declarations: [HomeComponent],
  imports: [
    NgxTweetModule,
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    TagCloudModule,
    FormsModule,
    IconsModule,
    TranslateModule,
    AngularSvgIconModule,
    NgbModule,
    CarouselModule,
    ButtonModule,
    NgxTwitterTimelineModule, 
    DialogModule
  ],

})
export class HomeModule { }
