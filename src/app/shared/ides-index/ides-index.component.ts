import {
  Component,
  OnInit,
  ViewChild,
  Input,
  OnDestroy,
  HostListener,
} from "@angular/core";
import { Filters } from "src/app/core/models/filters.model";
import { Variable } from "src/app/core/models/variable.model";
import { Region } from "src/app/core/models/regions.model";
import { ItemDropdown } from "src/app/core/models/item-dropdown.model";
import { Label, Color, BaseChartDirective } from "ng2-charts";
import { Data, Router } from "@angular/router";
import { DataService } from "src/app/core/services/data.service";
import { RegionService } from "src/app/core/services/region.service";
const years = require("src/app/core/const/years.data");
import * as pluginAnnotations from "chartjs-plugin-annotation";
import { RadialChartOptions, ChartDataSets, ChartType } from "chart.js";
import { Options } from "ng5-slider";
import { Observable } from "rxjs";
import { ResultList } from "src/app/core/models/resultList.model";
import { Clasification } from "src/app/core/models/clasification.model";
import { ClasificationService } from "src/app/core/services/clasification.service";
import { map, filter } from 'rxjs/operators';
import { SelectItem } from "primeng/api";
import { ChartsService } from "src/app/core/services/charts.service";
let { capitalizeFirst } = require("../../core/utils/utils");

import * as Highcharts from "highcharts";
import MO_Highcharts from 'highcharts/highcharts-more';
import HC_exporting from "highcharts/modules/exporting";
import HC_export from "highcharts/modules/export-data";
import HC_accessibility from 'highcharts/modules/accessibility';
import { OnChanges } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { TriStateCheckbox } from 'primeng';
import { TreeNode } from 'primeng/api';
require('../../../assets/js/exportxlsx')(Highcharts);



const roundTo = require('round-to');


@Component({
  selector: "app-ides-index",
  templateUrl: "./ides-index.component.html",
  styleUrls: ["./ides-index.component.scss"],
})
export class IdesIndexComponent implements OnInit, OnDestroy, OnChanges {
  Array = Array;



  filters: Filters = {
    page: 0,
    limit: 100,
    ascending: true,
    sort: "_id",
  };


  options: Options = {
    ceil: 2020,
    floor: 2010,
  };

  highcharts: any;
  updateDemo: boolean;
  chartOptions: any = {};
  clasifications: any = [];
  series: any = [];
  cols: any[];
  subcols: any[];
  dataTable: any[];


  downloadPNG: string;
  donwloadJPEG: string;
  downloadSVG: string;
  downloadPDF: string;
  downloadCSV: string;
  downloadXLS: string;



  items: any[] = [];
  data: any[] = [];
  display: boolean = false;
  chartDetails: any;



  @Input('indexes') indexes: any;


  marginSocial: string;
  imageBase64: any;
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

  body: any;

  constructor(
    private dataService: DataService,
    private regionService: RegionService,
    private chartService: ChartsService,
    private router: Router,
    private translateService: TranslateService
  ) {

    this.updateDemo = false;
    this.highcharts = Highcharts;
    HC_exporting(this.highcharts);
    HC_export(this.highcharts);
    HC_accessibility(this.highcharts);
    MO_Highcharts(this.highcharts);
  }

  ngOnInit() { }

  ngOnChanges(changes) {

    if (changes["indexes"] || this.indexes.length > 0) {

      this.translate()


    }

  }








  filterData() {


    this.clasifications = [];
    this.series = [];

    //load categories to radar
    for (let i = 0; i < this.indexes[0].data.length; i++) {

      this.clasifications.push(this.indexes[0].data[i].clasification.name)


    }


    for (let i = 0; i < this.indexes.length; i++) {

      let data = [];

      for (let j = 0; j < this.indexes[i].data.length; j++) {
        data.push(this.indexes[i].data[j].acum)
      }



      this.series.push({
        name: this.indexes[i].canton.name,
        data,
        pointPlacement: 'on'

      })
    }


    this.createRadar()
    this.createTable();
    //this.createTabView();


  }


  createTable() {



    this.cols = [
      { field: 'indice', header: 'indicator' },
      { field: 'value', header: 'value' },
      { field: 'interpretation', header: 'interpretation' },
      //{ field: 'categorie', header: 'categorie' },
      { field: 'color', header: 'colorchart' },



    ];





    // console.log(this.indexes);


    this.items = [];

    for (let i = 0; i < this.indexes.length; i++) {
      let clasification = {};
      let variable = {};
      this.data = [];
      let rangoc = [{ min: 0, max: 49.9, color: 'red-variable', level: 'Bajo', simbolo: '%' },
      { min: 50, max: 79.9, color: 'yellow-variable', level: 'Medio', simbolo: '%' },
      { min: 80, max: 100, color: 'green-variable', level: 'Alto', simbolo: '%' }];


      // console.log(this.indexes[i].canton.name);


      for (let j = 0; j < this.indexes[i].data.length; j++) {






        let interpretation = [];

        let arrayInterpretation = this.indexes[i].data[j].clasification.interpretation.split('.');

        interpretation.push(arrayInterpretation[0])

        //console.log(arrayInterpretation[0]);
        //console.log(arrayInterpretation[1]);












        clasification = {
          indice: this.indexes[i].data[j].clasification,
          value: `${this.indexes[i].data[j].acum} %`,
          interpretation,
          categorie: rangoc,
          year: this.indexes[i].data[j].year,
          fuente: this.indexes[i].data[j].fuente,
          color: this.indexes[i].data[j].color
        }

        let variables = [];



        for (let k = 0; k < this.indexes[i].data[j].data.length; k++) {

          let color = '';
          let value;
          let simbolo = '';
          let rango = [];
          let interpretation = [];





          if (this.indexes[i].data[j].data[k].rango) {




            simbolo = this.indexes[i].data[j].data[k].variable.measure_symbol;

            color = this.indexes[i].data[j].data[k].intervalo.color;




            if (this.indexes[i].data[j].data[k].variable.code === '0105') {
              value = `${simbolo} ${this.indexes[i].data[j].data[k].origen} `;

            } else {
              value = `${this.indexes[i].data[j].data[k].origen} ${simbolo}`;

            }










            for (let w = 0; w < this.indexes[i].data[j].data[k].rango.length; w++) {


              let min;
              let max;
              let color;
              let level;

              if (this.indexes[i].data[j].data[k].variable.code === '0801' ||
                this.indexes[i].data[j].data[k].variable.code === '0802' ||
                this.indexes[i].data[j].data[k].variable.code === '0803') {

                min = this.indexes[i].data[j].data[k].rango[w].value;
                max = '';
                color = `${this.indexes[i].data[j].data[k].rango[w].color}-variable`;
                level = this.indexes[i].data[j].data[k].rango[w].level;

                rango.push({ min, max, color, level, simbolo });

              } else {


                min = roundTo(this.indexes[i].data[j].data[k].rango[w].min_intervalo, 2);
                max = roundTo(this.indexes[i].data[j].data[k].rango[w].max_intervalo, 2)
                color = `${this.indexes[i].data[j].data[k].rango[w].color}-variable`;
                level = this.indexes[i].data[j].data[k].rango[w].level;

                rango.push({ min, max, color, level, simbolo });
              }

            }



          }



          let arrayInterpretation = this.indexes[i].data[j].data[k].variable.interpretation.split('.');

          // console.log(arrayInterpretation[0]);
          // console.log(arrayInterpretation[1]);

          interpretation.push(arrayInterpretation[0])
          interpretation.push(arrayInterpretation[1])


          variable = {
            indice: this.indexes[i].data[j].data[k].variable,
            value,
            interpretation,
            categorie: rango,
            color,
            year: this.indexes[i].data[j].data[k].year,
            fuente: this.indexes[i].data[j].fuente,

          }

          variables.push({ data: variable, expanded: false, });

        }

        //console.log('-------------------------');



        this.data.push({
          data: clasification,
          children: variables

        })





      }



      this.items.push({
        header: this.indexes[i].canton.name,
        table: this.data
      })



      //console.log(this.items);







    }
    //console.log(this.data);


  }



  showDialog(data) {

    //console.log(data);


    this.dataTable = [];

    this.subcols = [

      { field: 'name', header: 'name', width: '5px' },
      { field: 'description', header: 'description', width: '90px' }

    ]

    this.display = true;
    let dataRow1 = {

      name: 'Categoría',
      description: data.categorie

    }

    this.dataTable.push(dataRow1)

    let name;



    if (data.indice.is_indice) {
      name = 'Variable';

    } else {
      name = 'Indicador'
    }

    let dataRow2 = {
      name,
      description: data.indice.name

    }

    this.dataTable.push(dataRow2)


    let dataRow3 = {
      name: 'Periodo',
      description: data.year

    }

    this.dataTable.push(dataRow3)


    let dataRow4 = {
      name: 'Descripción',
      description: data.indice.description
    }

    this.dataTable.push(dataRow4)

    let dataRow5 = {};

    if (data.indice.is_indice) {

      let origins = [];
      for (let i = 0; i < data.indice.origins.length; i++) {
        origins.push(data.indice.origins[i].name)

      }
      dataRow5 = {
        name: 'Fuente',
        description: origins
      }
    } else {
      dataRow5 = {
        name: 'Fuente',
        description: data.fuente
      }
    }



    this.dataTable.push(dataRow5)




  }














  createRadar() {



    this.chartOptions = {
      chart: {
        polar: true,
        type: 'line'
      },
      title: {
        text: null,
      },

      pane: {
        size: '80%'
      },

      xAxis: {
        categories: this.clasifications,
        tickmarkPlacement: 'on',
        lineWidth: 0,
        labels: {
          align: 'center',
          distance: 30

        }

      },

      yAxis: {
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: 0,
        showLastLabel: true,
        tickPositions: [0, 50, 100]

      },

      tooltip: {
        //shared: true,
        pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}%</b><br/>'
      },

      series: this.series,

      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal'
            },
            pane: {
              size: '70%'
            }
          }
        }]
      },

      exporting: {
        allowHTML: true,
        sourceWidth: 1200,
        sourceHeight: 600,
        filename: `ideas_urbanas_indice_multivaribale_ciudades`,
        chartOptions: {
          title: {
            useHTML: true,
            text: `<span style="color:#124ca6;">Indice Multivariable de Ciudades<span/>`,
            margin: 50

          },

          subtitle: {
            useHTML: true,
            text: `<span style="text-align: justify; text-align: justify">Indice Multivariable de Ciudades.</span>
                   <span style="color:#124ca6;">[IDEAS Urbanas]<span/>`,
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
              {
                text: 'Descargar CSV', onclick() { this.downloadCSV(); }
              },
              {
                text: 'Descargar XLSX', onclick() { this.downloadXLSX(); }
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
    };
    this.updateDemo = true;
    this.chartDetails = {
      type: 'png',
      options: this.chartOptions
    };
  }



  translate() {

    this.translateService.stream(['downloadPNG', 'downloadJPEG', 'downloadSVG', 'downloadPDF', 'downloadCSV', 'downloadXLS'])
      .subscribe(title => {


        Object.keys(title).forEach((key) => {

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
        this.filterData()

      });

  }

  ngOnDestroy() {
    sessionStorage.clear();
  }
}
