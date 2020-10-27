import { Component, Input, OnInit, OnChanges } from '@angular/core';
import * as Highcharts from "highcharts";
import HC_exporting from "highcharts/modules/exporting";
import HC_export from "highcharts/modules/export-data";
import Acess from 'highcharts/modules/accessibility';
HC_exporting(Highcharts);
HC_export(Highcharts);
Acess(Highcharts);
//require('../../../assets/js/titleXLSX')(Highcharts);
require('../../../assets/js/exportxlsx')(Highcharts);
const { exportCSV, exportXLSX,lowerCase }: any = require('../../core/utils/utils');




@Component({
  selector: 'app-card-basic-chart',
  templateUrl: './card-basic-chart.component.html',
  styleUrls: ['./card-basic-chart.component.scss']
})
export class CardBasicChartComponent implements OnInit, OnChanges {

  @Input("series") series: any[];
  @Input("variable") variable: any;
  @Input("years") years: any;


  updateDemo: boolean;
  chartOptionsLine: any = {};
  chartOptionsBar: any = {};
  chartOptionsStacked: any = {};

  highcharts: any;
  chartDetails: any;

  optionsDate = { year: 'numeric', month: 'short', day: 'numeric' };
  languajeDate = 'es-ES';



  constructor() {

    this.updateDemo = false;
    this.highcharts = Highcharts;

  }

  ngOnInit() {
  }

  ngOnChanges(changues) {

    if (this.series.length > 0) {


      if (this.variable.chart_type === 'lineal') {

        this.createLineChart();

      }

      if (this.variable.chart_type === 'bar') {


        this.createBarChart();
      }

      if (this.variable.chart_type === 'stacked bar chart') {
        this.createStacked();
      }






    }

  }

  createLineChart() {

    let serie = this.series;
    let categories = this.years;
    let variable = this.variable;
    let datesCity = [];
    let dates = [];

    if (variable.periodicity === 'mensual') {

      for (let i = 0; i < this.years.length; i++) {

        let date = new Date(this.years[i]).toLocaleDateString(this.languajeDate, this.optionsDate);

        datesCity.push(date);


      }

      dates = datesCity.filter((data, index) => {
        return datesCity.indexOf(data) === index;
      });



    } else {
      dates = this.years;
    }





    this.chartOptionsLine = {

      title: {
        text: null,

      },

      caption: {
        text: `[${this.variable.origins[0].name}]`,
        style: {
          display: 'none'
        }
      },

      xAxis: {
        categories: dates,
        crosshair: true
      },

      yAxis: {
        title: {
          text: `${this.variable.label}(${this.variable.measure_symbol})`
        }
      },

      tooltip: {
        useHTML: true,
        formatter: function () {
          let value;
          if (this.y >= 1000) {
            value = this.y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          } else {
            value = this.y;
          }
          return `<strong style="color:#124ca6; font-size: 15px">${this.series.userOptions.category.name} ${this.x} </strong></br>
          <span style="color: ${this.color}">●</span> <strong style="color: ${this.color}">${this.series.name}</strong> </br>
          ${value} ${this.series.userOptions.category.measure_symbol}`

        }
      },

      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top'
      },

      exporting: {
        allowHTML: true,
        sourceWidth: 1200,
        sourceHeight: 600,
        filename: `ideas_urbanas_${lowerCase (this.variable.name)}`,
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
              },*/
              /* {
                 text: 'Descargar XLSX', onclick() { this.downloadXLSX(); }
               },*/
              {
                text: 'Descargar CSV', onclick() {
                  exportCSV(variable, categories, serie);
                }
              },
              {
                text: 'Descargar XLSX', onclick() {
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

      series: this.series,

      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'top'
            }
          }
        }]
      }

    }

    this.updateDemo = true;

    this.chartDetails = {
      type: 'png',
      options: this.chartOptionsLine
    };

  }



  createBarChart() {

    let serie = this.series;
    let categories = this.years;
    let variable = this.variable;


    this.chartOptionsBar = {

      chart: {
        type: 'column'
      },
      title: {
        text: null
      },

      xAxis: {
        categories: this.years,
        crosshair: true
      },

      yAxis: {
        title: {
          text: `${this.variable.label}(${this.variable.measure_symbol})`
        }
      },

      exporting: {
        allowHTML: true,
        sourceWidth: 1200,
        sourceHeight: 600,
        filename: `ideas_urbanas_${lowerCase (this.variable.name)}`,
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
              },*/
              /* {
                 text: 'Descargar XLSX', onclick() { this.downloadXLSX(); }
               },*/
              {
                text: 'Descargar CSV', onclick() {
                  exportCSV(variable, categories, serie);
                }
              },
              {
                text: 'Descargar XLSX', onclick() {
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

      tooltip: {
        useHTML: true,
        formatter: function () {

          let value;
          if (this.y >= 1000) {
            value = this.y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          } else {
            value = this.y;
          }
          return `<strong style="color:#124ca6; font-size: 15px">${this.series.userOptions.category.name} ${this.x} </strong></br>
          <span style="color: ${this.color}">●</span> <strong style="color: ${this.color}">${this.series.name}</strong> </br>
          ${value} ${this.series.userOptions.category.measure_symbol}`

        },
        //shared: true,

      },
      /*tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },*/

      series: this.series

    };
    this.updateDemo = true;
    this.chartDetails = {
      type: 'png',
      options: this.chartOptionsBar
    };

  }


  createStacked() {

    let categorie = [];
    let serie = [];
    let variable = this.variable;



    for (let i = 0; i < this.series.length; i++) {


      categorie.push(this.series[i].name)

      Object.keys(this.series[i].data[0]).forEach((k, idx) => {




        let values = [];
        values.push(this.series[i].data[0][k])

        if (serie.length > 0) {



          /* for (let j = 0; j < serie.length; j++) {
 
             if (serie[j].name === k) {
               console.log('ERN', serie[j].name);
 
             }
 
 
           }*/



          let serieData = {
            name: k,
            data: values,
            category: this.variable

          }


          if (serie.filter(data => data.name === k).length) {

            serie[idx].data = [...serie[idx].data, this.series[i].data[0][k]]


          } else {
            serie.push(serieData)
          }







          /*if (serie[idx - 1].name === k) {
            console.log('ENTRO', serie[i].name, k);

            serie[idx].data = [...serie[idx].data, this.series[i].data[0][k]]

          } else {
            serie.push({
              name: k,
              data: values
            })
          }*/


        } else {
          serie.push({
            name: k,
            data: values,
            category: this.variable
          })
        }







      });





      this.chartOptionsStacked = {
        chart: {
          type: 'column'
        },
        title: {
          text: null
        },

        xAxis: {
          categories: categorie,
          crosshair: true
        },

        yAxis: {
          title: {
            text: `${this.variable.label}(${this.variable.measure_symbol})`
          }
        },

        tooltip: {
          useHTML: true,
          formatter: function () {



            let value;
            if (this.y >= 1000) {
              value = this.y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
              value = this.y;
            }
            return `<strong style="color:#124ca6; font-size: 15px">${this.series.userOptions.category.name} ${this.x} </strong></br>
            <span style="color: ${this.color}">●</span> <strong style="color: ${this.color}">${this.series.name}</strong> </br>
            ${value} ${this.series.userOptions.category.measure_symbol}`

          },
          //shared: true,

        },
        plotOptions: {
          column: {
            stacking: 'normal',
          }
        },
        exporting: {
          allowHTML: true,
          sourceWidth: 1200,
          sourceHeight: 600,
          filename: `ideas_urbanas_${lowerCase (this.variable.name)}`,
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
              },*/
                /* {
                   text: 'Descargar XLSX', onclick() { this.downloadXLSX(); }
                 },*/
                {
                  text: 'Descargar CSV', onclick() {
                    exportCSV(variable, categorie, serie);
                  }
                },
                {
                  text: 'Descargar XLSX', onclick() {
                    exportXLSX(variable, categorie, serie);
                  }
                },
              ]
            }
          },
          csv: {
            columnHeaderFormatter: function (item, key) {
              if (!key) {
                return 'Ciudad';
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
        series: serie
      };


      this.updateDemo = true;


      this.chartDetails = {
        type: 'png',
        options: this.chartOptionsStacked
      };


      /* for (let j = 0; j < this.series[i].data; j++) {
 
         let values = []
 
         Object.keys(this.series[i][j].value).forEach((k) => {
 
         });
         const element = array[j];
 
       }*/

    }

  }


}

