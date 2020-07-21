import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_export from 'highcharts/modules/export-data';
import Color_Axis from 'highcharts/modules/coloraxis';
import Series_Label from 'highcharts/modules/series-label';



@Component({
  selector: 'app-card-basic-graph-covid',
  templateUrl: './card-basic-graph-covid.component.html',
  styleUrls: ['./card-basic-graph-covid.component.scss']
})
export class CardBasicGraphCovidComponent implements OnInit, OnChanges {

  highcharts: any;
  updateDemo: boolean;
  chartOptions: any = {};

  @Input("dates") dates: any[];
  @Input("data") data: any[];
  @Input('variable') variable: any;



  constructor() {

    this.updateDemo = false;
    this.highcharts = Highcharts;
    HC_exporting(this.highcharts);
    HC_export(this.highcharts);
    Color_Axis(this.highcharts);
    Series_Label(this.highcharts);


  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if (changes['data']) {
      this.createBarChart();
    }
  }

  createBarChart() {


    this.chartOptions = {
      chart: {
        type: "column",
        animation: true,
        borderColor: '#000000',
        borderRadius: 20,
        borderWidth: 1,

      },
      title: {
        useHTML: true,
        text: 'Evolución Espacial del COVID-19'
      },
      xAxis: {
        categories: this.dates,

      },
      colorAxis: {

        minColor: '#ffeda0',
        maxColor: '#bd0026',

      },
      yAxis: {
        title: {
          text: 'Número de casos'
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        enabled: true,
        crosshairs: true
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            crop: false,
            overflow: 'none',
            align: 'left',
            inside: true,
            format: '{series.name}',
            rotation: 270,
            color: 'black'
          }
        }
      },
      exporting: {
        filename: `casos_${this.variable.name}_covid19`
      },
      series: this.data
    };

    this.updateDemo = true;

  }
}
