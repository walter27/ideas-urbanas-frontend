import { Component, Input, OnInit, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts/highmaps';
import HC_exporting from 'highcharts/modules/exporting';
import HC_export from 'highcharts/modules/export-data';
import Color_Axis from 'highcharts/modules/coloraxis';
import { TranslateService } from '@ngx-translate/core';


const catones: any = require('../../../assets/geojson/geojson_ecuador_cantones.json');


@Component({
  selector: 'app-card-basic-map-covid',
  templateUrl: './card-basic-map-covid.component.html',
  styleUrls: ['./card-basic-map-covid.component.scss']
})
export class CardBasicMapCovidComponent implements OnInit, OnChanges {

  highcharts: any;
  updateDemo: boolean;
  chartOptions: any = {};
  chartConstructor = 'mapChart';
  title: string;
  downloadPNG: string;
  donwloadJPEG: string;
  downloadSVG: string;
  downloadPDF: string;
  downloadCSV: string;
  downloadXLS: string;

  @Input("data") data: any[];
  @Input('variable') variable: any;

  constructor(private translateService: TranslateService) {
    this.updateDemo = false;
    this.highcharts = Highcharts;
    HC_exporting(this.highcharts);
    HC_export(this.highcharts);
    Color_Axis(this.highcharts);
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if (changes['data']) {
      //this.createMap();
      this.translate();
    }
  }

  createMap() {
    this.chartOptions = {
      chart: {
        map: catones,
        animation: true,
        backgroundColor: '#E5E8E8 ',
        borderRadius: 20,
        events: {
          load: function () {
            setTimeout(() => {
              this.mapZoom(0.5, -3);
            }, 0.01);
          }
        }
      },
      title: {
        text: this.title,
        style: {
          color: '#243554',
          fontWeight: 'bold',
          font: 'Roboto, sans-serif',
        }
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          alignTo: 'spacingBox'
        }
      },
      colorAxis: {
        tickPixelInterval: 30,
        minColor: '#ffeda0',
        maxColor: '#bd0026'
      },
      exporting: {
        filename: `casos_${this.variable.name}_covid19_espacial`,
        buttons: {
          contextButton: {
            menuItems: [
              {
                text: this.downloadPNG, onclick() { this.exportChart({ type: 'image/png' }); }
              },
              {
                text: this.donwloadJPEG, onclick() { this.exportChart({ type: 'image/jpeg' }); }
              },
              {
                text: this.downloadSVG, onclick() { this.exportChart({ type: 'image/svg+xml' }); }
              },
              {
                text: this.downloadPDF, onclick() { this.exportChart({ type: 'application/pdf' }); }
              },
              {
                text: this.downloadCSV, onclick() { this.downloadCSV(); }
              },
              {
                text: this.downloadXLS, onclick() { this.downloadXLS(); }
              },
            ]
          }
        }
      },
      series: [{
        data: this.data,
        keys: ['id', 'value'],
        joinBy: 'id',
        name: `Número de Casos ${this.variable.name}`,
        states: {
          hover: {
            color: '#a4edba'
          }
        },
        dataLabels: {
          enabled: true,
          color: 'black',
          format: '{point.properties.name}',
          style:
          {
            font: 'normal 1px Verdana, sans-serif'
          }
        }
      }]
    };
  }


  translate() {

    this.translateService.stream(['title_map', 'downloadPNG', 'downloadJPEG', 'downloadSVG', 'downloadPDF', 'downloadCSV', 'downloadXLS']).subscribe(title => {


      Object.keys(title).forEach((key) => {

        if (key === 'title_map') {
          this.title = title[key];
        }
        if (key === 'downloadPNG') {
          this.downloadPNG = title[key];
        }
        if (key === 'downloadJPEG') {
          this.donwloadJPEG = title[key];
        }
        if (key === 'downloadSVG') {
          this.downloadSVG = title[key];
        }
        if (key === 'downloadPDF') {
          this.downloadPDF = title[key];
        }
        if (key === 'downloadCSV') {
          this.downloadCSV = title[key];
        }
        if (key === 'downloadXLS') {
          this.downloadXLS = title[key];
        }


      });
      this.createMap();

    });

  }

}
