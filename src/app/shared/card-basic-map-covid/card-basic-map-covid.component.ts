import { Component, Input, OnInit, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts/highmaps';
import HC_exporting from 'highcharts/modules/exporting';
import HC_export from 'highcharts/modules/export-data';
import Color_Axis from 'highcharts/modules/coloraxis';
import { TranslateService } from '@ngx-translate/core';


const catones: any = require('../../../assets/geojson/geojson_ecuador_cantones.json');
const { exportCSV, exportXLSX, titleCase, lowerCase }: any = require('../../core/utils/utils');



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
    if (changes["data"]) {
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
        allowHTML: true,
        sourceWidth: 1200,
        sourceHeight: 600,
        filename: `ideas_urbanas_casos_${lowerCase(this.variable.name)}_covid19_espacial`,
        chartOptions: {
          title: {
            useHTML: true,
            text: `<span style="color:#124ca6;">${this.variable.name}<span/>`,
            margin: 50

          },

          subtitle: {
            useHTML: true,
            text: `<span style="text-align: justify; text-align: justify">${this.variable.description}.</span>
                   <span style="color:#124ca6;">[${this.variable.origins[0].name}]<span/>`,
            // text: '<span style="color:#00ff00;">1stline</span>' + '<br>' + '<span style="color:#ff0000;">2ndline</span>',
            align: 'left',
            verticalAlign: 'bottom',
            y: 10,
            x: 30
          },
          chart: {
            events: {
              load: function () {
                var chart = this;
                chart.renderer.image(
                  'https://api-ideas-urbanas.uhemisferios.edu.ec/file/reportes/logo-color.svg',
                  30,
                  -210,
                  200,
                  500
                )
                  .add();
              }
            }
          }
        },
        buttons: {
          contextButton: {
            enabled: true,
            menuItems: [
              {
                text: 'Descargar PNG', onclick() { this.exportChart({ type: 'image/png' }); }
              },
              {
                text: 'Descargar JPEG', onclick() { this.exportChart({ type: 'image/jpeg' }); }
              },
              {
                text: 'Descargar PDF', onclick() { this.exportChart({ type: 'application/pdf' }); }
              },
              /*{
                text: 'Descargar CSV', onclick() { this.downloadCSV(); }
              },
              {
                text: 'Descargar XLSX', onclick() { this.downloadXLSX(); }
              },*/
            ]
          }
        },
        /* csv: {
           columnHeaderFormatter: function (item, key) {
             if (!key) {
               return 'Fecha';
             }
             return false;
           }
         },*/
        /* xlsx: {
           worksheet: {
             autoFitColumns: true,
             categoryColumnTitle: 'Month',
             dateFormat: 'yyyy-mm-dd',
             name: 'data'
           },
           workbook: {
             fileProperties: {
               Author: "IDEAS Urbanas",
               Company: "Universidad de los Hemisferios",
               CreatedDate: new Date(Date.now())
             }
           }
         }*/
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

    this.updateDemo = true;

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
