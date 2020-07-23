import { Component, OnInit, OnChanges, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_export from 'highcharts/modules/export-data';
import Color_Axis from 'highcharts/modules/coloraxis';
import Series_Label from 'highcharts/modules/series-label';
import Streamgraph from 'highcharts/modules/streamgraph';


@Component({
  selector: 'app-card-basic-streamgraph',
  templateUrl: './card-basic-streamgraph.component.html',
  styleUrls: ['./card-basic-streamgraph.component.scss']
})
export class CardBasicStreamgraphComponent implements OnInit, OnChanges {

  highcharts: any;
  updateDemo: boolean;
  chartOptions: any = {};

  @Input("dates") dates: any[];
  @Input("data") data: any[];
  @Input("min") min: number;
  @Input("max") max: number;
  @Input('variable') variable: any;



  constructor() {

    this.updateDemo = false;
    this.highcharts = Highcharts;
    Streamgraph(this.highcharts);
    HC_exporting(this.highcharts);
    HC_export(this.highcharts);
    Color_Axis(this.highcharts);
    Series_Label(this.highcharts);
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if (changes['data']) {
      this.createStreamGraph();

    }
  }

  createStreamGraph() {
    this.chartOptions = {
      chart: {
        type: "streamgraph",
        animation: true,
        marginBottom: 120,
        borderColor: '#000000',
        borderRadius: 20,
        borderWidth: 1,
        //zoomType: 'x',
        /* events: {
           afterSetExtremes: function () {
             console.log(this.getExtremes());
           }
         }*/

      },
      title: {
        text: 'Evolución Temporal COVID-19',
        style: {
          color: '#243554',
          fontWeight: 'bold',
          font: 'Roboto, sans-serif',
        }
      },
      xAxis: {
        type: 'categories',
        min: this.min,
        max: this.max,
        crosshair: true,
        categories: this.dates,
        labels: {
          align: 'right',
          reserveSpace: false,
          rotation: 270
        },

        /*events: {
          setExtremes: function (e) {


            console.log(e);


          },

          afterSetExtremes: function () {
            console.log(this.getExtremes());
          }
        },*/

      },
      colorAxis: {

        minColor: '#ffeda0',
        maxColor: '#bd0026',

      },
      yAxis: {
        visible: false,
        startOnTick: false,
        endOnTick: false
      },
      legend: {
        enabled: false
      },
      exporting: {
        filename: `casos_${this.variable.name}_covid19_temporal`
      },

     /* plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            crop: false,
            overflow: 'none',
            align: 'left',
            inside: true,
            format: '{series.name}',
            color: 'black'
          }
        }
      },*/
      series: this.data,
    };
  }

}
