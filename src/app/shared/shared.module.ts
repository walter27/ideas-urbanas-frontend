import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IdesDatatableComponent } from './ides-datatable/ides-datatable.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { IconsModule } from '../icons/icons.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NavbarItemComponent } from './navbar-item/navbar-item.component';
import { AllowMenuItemDirective } from './directives/allow-menu-item.directive';
import { FooterComponent } from './footer/footer.component';
import { IdesDropdownComponent } from './ides-dropdown/ides-dropdown.component';
import { CardBasicGraphComponent } from './card-basic-graph/card-basic-graph.component';
import { IdesThematicComponent } from './ides-thematic/ides-thematic.component';
import { IdesTabItemComponent } from './ides-tab-item/ides-tab-item.component';
import { ChartsModule } from 'ng2-charts';
import { IdesCardClasificationComponent } from './ides-card-clasification/ides-card-clasification.component';
import { IdesCitizenReportsCardComponent } from './ides-citizen-reports-card/ides-citizen-reports-card.component';
import { IdesIndexComponent } from './ides-index/ides-index.component';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IdesDownloadComponent } from './ides-download/ides-download.component';
import { Ng5SliderModule } from 'ng5-slider';
import { ExportAsModule } from 'ngx-export-as';
import { IdesConfigsIndicatorComponent } from './ides-configs-indicator/ides-configs-indicator.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ThousandsPipe } from './directives/thousandsPipe.directive copy';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ColorPickerModule } from 'ngx-color-picker';
import { VectormapDirective } from './directives/vector-map';
import { TagcloudDirective } from './directives/tag-cloud';
import { CardBasicGraphCovidComponent } from './card-basic-graph-covid/card-basic-graph-covid.component';
import { CardBasicMapCovidComponent } from './card-basic-map-covid/card-basic-map-covid.component';
import { CardBasicGraphTimelineComponent } from './card-basic-graph-timeline/card-basic-graph-timeline.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { CardBasicNewsComponent } from './card-basic-news/card-basic-news.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardBasicStreamgraphComponent } from './card-basic-streamgraph/card-basic-streamgraph.component';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import {CarouselModule} from 'primeng/carousel';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {TableModule} from 'primeng/table';
import { IdesOriginComponent } from './ides-origin/ides-origin.component';
import { WordCloudComponent } from './word-cloud/word-cloud.component';
import { IdesVideosComponent } from './ides-videos/ides-videos.component';
import {GalleriaModule} from 'primeng/galleria';
import { LightboxModule } from 'primeng/lightbox';
import {InputTextModule} from 'primeng/inputtext';
import { IdesSocialMediaComponent } from './ides-social-media/ides-social-media.component';
import { IdesAuthorsComponent } from './ides-authors/ides-authors.component';
import { IdesDatatableValuesindiceComponent } from './ides-datatable-valuesindice/ides-datatable-valuesindice.component';
import { DialogModule } from 'primeng/dialog';
import {InputNumberModule} from 'primeng/inputnumber';
import { IdesCitizenReportsInfoComponent } from './ides-citizen-reports-info/ides-citizen-reports-info.component';






export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    HeaderComponent,
    IdesDatatableComponent,
    NavbarItemComponent,
    AllowMenuItemDirective,
    ThousandsPipe,
    FooterComponent,
    IdesDropdownComponent,
    CardBasicGraphComponent,
    IdesThematicComponent,
    IdesTabItemComponent,
    IdesCardClasificationComponent,
    IdesCitizenReportsCardComponent,
    IdesIndexComponent,
    IdesDownloadComponent,
    IdesConfigsIndicatorComponent,
    VectormapDirective,
    TagcloudDirective,
    CardBasicGraphCovidComponent,
    CardBasicMapCovidComponent,
    CardBasicGraphTimelineComponent,
    CardBasicNewsComponent,
    CardBasicStreamgraphComponent,
    IdesOriginComponent,
    WordCloudComponent,
    IdesVideosComponent,
    IdesSocialMediaComponent,
    IdesAuthorsComponent,
    IdesDatatableValuesindiceComponent,
    IdesCitizenReportsInfoComponent
  ],
  exports: [
    HeaderComponent,
    IdesDatatableComponent,
    NavbarItemComponent,
    FooterComponent,
    IdesDropdownComponent,
    CardBasicGraphComponent,
    IdesThematicComponent,
    IdesTabItemComponent,
    IdesCardClasificationComponent,
    IdesCitizenReportsCardComponent,
    IdesIndexComponent,
    IdesDownloadComponent,
    IdesConfigsIndicatorComponent,
    TranslateModule,
    VectormapDirective,
    TagcloudDirective,
    CardBasicGraphCovidComponent,
    CardBasicMapCovidComponent,
    CardBasicGraphTimelineComponent,
    CardBasicNewsComponent,
    CardBasicStreamgraphComponent,
    WordCloudComponent,
    IdesVideosComponent,
    IdesSocialMediaComponent,
    IdesAuthorsComponent,
    IdesDatatableValuesindiceComponent,
    IdesCitizenReportsInfoComponent
  ],
  imports: [
    CommonModule,
    AngularFontAwesomeModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    IconsModule,
    RouterModule,
    ChartsModule,
    FormsModule,
    ExportAsModule,
    Ng5SliderModule,
    TooltipModule,
    NgbModule,
    ColorPickerModule,
    DropdownModule,
    MultiSelectModule,
    CarouselModule,
    ButtonModule,
    TableModule,
    ToastModule,
    DialogModule,
    InputNumberModule,
    LightboxModule,
    InputTextModule,
    GalleriaModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class SharedModule {
}
