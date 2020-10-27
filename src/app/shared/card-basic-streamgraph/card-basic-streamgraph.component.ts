import { Component, OnInit, OnChanges, Input } from "@angular/core";
import * as Highcharts from "highcharts";
import HC_exporting from "highcharts/modules/exporting";
import HC_export from "highcharts/modules/export-data";
import Color_Axis from "highcharts/modules/coloraxis";
import Series_Label from "highcharts/modules/series-label";
import Streamgraph from "highcharts/modules/streamgraph";
import { ChartsService } from "src/app/core/services/charts.service";
import { TranslateService } from '@ngx-translate/core';

const { exportCSV, exportXLSX, titleCase, lowerCase }: any = require('../../core/utils/utils');


@Component({
  selector: "app-card-basic-streamgraph",
  templateUrl: "./card-basic-streamgraph.component.html",
  styleUrls: ["./card-basic-streamgraph.component.scss"],
})
export class CardBasicStreamgraphComponent implements OnInit, OnChanges {
  chartDetails: any;
  highcharts: any;
  updateDemo: boolean;
  chartOptions: any = {};
  chartOptionsExport: any = {};
  title; string;
  downloadPNG: string;
  donwloadJPEG: string;
  downloadSVG: string;
  downloadPDF: string;
  downloadCSV: string;
  downloadXLS: string;

  optionsDate = { year: 'numeric', month: 'short', day: 'numeric' };
  languajeDate = 'es-ES';

  @Input("dates") dates: any[];
  @Input("data") data: any[];
  @Input("variable") variable: any;
  @Input() maxExport: number;

  constructor(
    private chartService: ChartsService,
    private translateService: TranslateService) {
    this.updateDemo = false;
    this.highcharts = Highcharts;
    Streamgraph(this.highcharts)
    HC_exporting(this.highcharts);
    HC_export(this.highcharts);
    Color_Axis(this.highcharts);
    Series_Label(this.highcharts);


  }

  ngOnInit() {


  }

  ngOnChanges(changes) {

    if (changes["data"]) {

      //console.log(this.data);
      
      this.translate();
      //this.createStreamGraph();
    }
  }

  createStreamGraph() {


    let serie = this.data;
    let categories = this.dates;
    let variable = this.variable;
    let datesCity = [];
    let dates = [];


    for (let i = 0; i < this.dates.length; i++) {

      let date = new Date(this.dates[i]).toLocaleDateString(this.languajeDate, this.optionsDate);

      datesCity.push(titleCase(date));


    }

    dates = datesCity.filter((data, index) => {
      return datesCity.indexOf(data) === index;
    });


    this.chartOptions = {
      chart: {
        type: "streamgraph",
        animation: true,
        marginBottom: 120,
        borderColor: "#000000",
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
        text: this.title,
        style: {
          color: "#243554",
          fontWeight: "bold",
          font: "Roboto, sans-serif",
        },
      },
      xAxis: {
        type: "category",
       // min: this.min,
       // max: this.max,
        crosshair: true,
        categories: dates,
        labels: {
          align: "right",
          reserveSpace: false,
          rotation: 270,
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
      /* colorAxis: {
 
         minColor: '#ffeda0',
         maxColor: '#bd0026',
 
       },*/
      yAxis: {
        visible: false,
        startOnTick: false,
        endOnTick: false,
      },

      legend: {
        enabled: false,
      },

      exporting: {
        allowHTML: true,
        sourceWidth: 1200,
        sourceHeight: 600,
        filename: `ideas_urbanas_casos_${lowerCase(this.variable.name)}_covid19_temporal`,
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
                text: this.downloadPNG, onclick() { this.exportChart({ type: 'image/png' }); }
              },
              {
                text: this.donwloadJPEG, onclick() { this.exportChart({ type: 'image/jpeg' }); }
              },
              {
                text: this.downloadPDF, onclick() { this.exportChart({ type: 'application/pdf' }); }
              },
              /*{
                text: 'Descargar CSV', onclick() { this.downloadCSV(); }
              },*/
              /* {
                 text: 'Descargar XLSX', onclick() { this.downloadXLSX(); }
               },*/
              {
                text: this.downloadCSV, onclick() {
                  exportCSV(variable, categories, serie);
                }
              },
              {
                text: this.downloadXLS, onclick() {
                  exportXLSX(variable, categories, serie);
                }
              },
            ]
          }
        },
        csv: {
          columnHeaderFormatter: function (item, key) {
            if (!key) {
              return 'Fecha';
            }
            return false;
          }
        },
        xlsx: {
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
        }
      },
      series: this.data,
    };

    this.chartOptionsExport = Object.assign({}, this.chartOptions);
    this.chartOptionsExport.xAxis.min = 0;
    this.chartOptionsExport.xAxis.max = this.maxExport;

    this.chartOptionsExport["legend"] = {
      layout: "vertical",
      align: "left",
      verticalAlign: "middle",
      itemMarginTop: 10,
      itemMarginBottom: 10,
    };

    this.chartOptionsExport["subtitle"] = {
      text: this.variable.name
    }

    this.chartDetails = {
      type: "jpeg",
      options: this.chartOptionsExport,
    };
  }

  translate() {

    this.translateService.stream(['title_streamgraph', 'downloadPNG', 'downloadJPEG', 'downloadSVG', 'downloadPDF', 'downloadCSV', 'downloadXLS']).subscribe(title => {


      Object.keys(title).forEach((key) => {

        if (key === 'title_streamgraph') {
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

      this.createStreamGraph();

    });

  }
}
