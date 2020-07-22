import { Component, Input, OnInit, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts/highmaps';
import HC_exporting from 'highcharts/modules/exporting';
import HC_export from 'highcharts/modules/export-data';
import Color_Axis from 'highcharts/modules/coloraxis';

const catones: any = require('../../../assets/geojson/cantones.json');


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


  @Input("data") data: any[];
  @Input('variable') variable: any;

  constructor() {
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
      this.createMap();

    }
  }

  createMap() {
    this.chartOptions = {
      chart: {
        map: catones,
        animation: true,
        backgroundColor: '#E5E8E8 ',
        borderRadius: 20,
        height: 345,
        events: {
          load: function () {
            setTimeout(() => {
              this.mapZoom(0.6, -2);
            }, 0.01);
          }
        }
      },
      title: {
        text: 'Ecuador'
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
        filename: `casos_${this.variable.name}_covid19_espacial`
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

}
