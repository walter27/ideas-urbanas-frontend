import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_export from 'highcharts/modules/export-data';
import Color_Axis from 'highcharts/modules/coloraxis';


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
            useHTML: true,
            formatter: function () {
              var styleStr = 'color:black; transform:rotate(270deg)';
              return (
                '<div style="' + styleStr + '">' +
                '&nbsp;' + this.series.name +
                '</div>'
              );
            },
            enabled: true,
            inside: true,
            y: -20,
            //rotation: 270,
            //format: '{y}%',
            //style: {
            fontSize: '0.75em',
            //  textShadow: false,
            //}
          }

        }
      },
      series: this.data

    };

    this.updateDemo = true;

  }
}
