import { Component, OnInit, Input, OnChanges } from "@angular/core";
import * as Highcharts from "highcharts";
import HC_exporting from "highcharts/modules/exporting";
import HC_export from "highcharts/modules/export-data";
import Color_Axis from "highcharts/modules/coloraxis";
import Series_Label from "highcharts/modules/series-label";
import { ChartsService } from "../../core/services/charts.service";
import { TranslateService } from '@ngx-translate/core';

require('../../../assets/js/exportxlsx')(Highcharts);

const { exportCSV, exportXLSX, titleCase, lowerCase }: any = require('../../core/utils/utils');



@Component({
  selector: "app-card-basic-graph-covid",
  templateUrl: "./card-basic-graph-covid.component.html",
  styleUrls: ["./card-basic-graph-covid.component.scss"],
})
export class CardBasicGraphCovidComponent implements OnInit, OnChanges {

  highcharts: any;
  updateDemo: boolean;
  chartOptions: any = {};
  title: string;
  titleChartY: string;
  downloadPNG: string;
  donwloadJPEG: string;
  downloadSVG: string;
  downloadPDF: string;
  downloadCSV: string;
  downloadXLS: string;
  chartDetails: any;

  optionsDate = { year: 'numeric', month: 'short', day: 'numeric' };
  languajeDate = 'es-ES';


  socialMedia: any = [
    {
      name: "Facebook",
      link: "",
      img: "social-facebook",
    },
    {
      name: "Twitter",
      link: "",
      img: "social-twitter",
    },
  ];

  @Input("dates") dates: any[];
  @Input("data") data: any[];
  @Input("variable") variable: any;

  constructor(
    private chartService: ChartsService,
    private translateService: TranslateService) {
    this.updateDemo = false;
    this.highcharts = Highcharts;
    HC_exporting(this.highcharts);
    HC_export(this.highcharts);
    Color_Axis(this.highcharts);
    Series_Label(this.highcharts);
  }

  ngOnInit() { }

  ngOnChanges(changes) {
    if (changes["data"]) {

      //console.log(this.data);


      this.translate();

      //this.createBarChart();
    }
  }

  createBarChart() {


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
        type: "column",
        animation: true,
        borderColor: "#000000",
        borderRadius: 20,
        borderWidth: 1,
      },
      title: {
        text: `${this.title}`,
        style: {
          color: "#243554",
          fontWeight: "bold",
          font: "Roboto, sans-serif",
        },
      },
      xAxis: {
        categories: dates,
      },
      colorAxis: {
        minColor: "#ffeda0",
        maxColor: "#bd0026",
      },
      yAxis: {
        title: {
          text: this.titleChartY,
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
        crosshairs: true,
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            crop: false,
            overflow: "none",
            align: "left",
            inside: true,
            format: "{series.name}",
            rotation: 270,
            color: "black",
          },
        },
      },

      exporting: {
        allowHTML: true,
        sourceWidth: 1200,
        sourceHeight: 600,
        filename: `ideas_urbanas_casos${lowerCase(this.variable.name)}_covid19`,
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

    this.updateDemo = true;
    this.chartDetails = {
      type: 'png',
      options: this.chartOptions
    };

  }

  translate() {

    this.translateService.stream(['number_cases', this.variable.name, 'downloadPNG', 'downloadJPEG', 'downloadSVG', 'downloadPDF', 'downloadCSV', 'downloadXLS']).subscribe(title => {


      Object.keys(title).forEach((key) => {

        if (key === 'number_cases') {
          this.titleChartY = title[key];
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
        if (key === this.variable.name) {
          this.title = title[key];
        }


      });
      this.createBarChart();

    });

  }
}
