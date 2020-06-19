import { Component, OnInit, OnChanges, AfterContentChecked, AfterViewChecked, AfterContentInit, OnDestroy } from '@angular/core';
import { ClasificationService } from '../../../../core/services/clasification.service';
import { VariableService } from '../../../../core/services/variable.service';
import { DataService } from '../../../../core/services/data.service';
import * as Highcharts from 'highcharts';
import * as Highcharts2 from 'highcharts/highmaps';

import HC_exporting from 'highcharts/modules/exporting';
import HC_export from 'highcharts/modules/export-data';

import { NgForm, FormGroup } from '@angular/forms';

//map
//import catones from '../../../../../assets/geojson/json';
import { RegionService } from '../../../../core/services/region.service';
import { Region } from 'src/app/core/models/regions.model';
import { Variable } from 'src/app/core/models/variable.model';

const catones: any = require('../../../../../assets/geojson/geojson_cantones.json');

import { Options, LabelType } from 'ng5-slider';





interface City {
  name: string;
  id: string;

}




@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.scss']
})
export class CovidComponent implements OnInit, OnChanges, AfterContentInit, AfterContentChecked, AfterViewChecked, OnDestroy {


  model = 'Canton';
  filters = {
    page: 0,
    limit: 100,
    ascending: true,
    sort: 'name'
  };

  cantons: Region[];
  selectedCantons: Region[];

  varibales2: Variable[];
  selectVariable: Variable;

  dates: Date[] = [];





  rangeValues: any = [];

  clasification: any = [];

  varibales: any = [];
  data: any = [];

  label: any = [];
  data2: any = [];

  covidBarChart: any;

  data3: any;

  data6: any;
  dataHigcharts: any = [];

  //highcharts = Highcharts;
  chartOptions: any = {};
  chartOptions6: any = {};

  highcharts: any;

  cities: City[];

  selectedCities: City[];


  //Mapa
  dataMapa: any[] = [];


  form: FormGroup;


  chart;
  chartCallback;
  title = 'app';
  updateFromInput = false;
  Highcharts = Highcharts2;
  chartConstructor = 'mapChart';
  chartOptionsMap: any = {};



  cursormin;
  cursormax;
  cursornum;
  cursor;


  dateRange: Date[];
  value: number;
  options: Options = {
    ceil: 0,
    floor: 0
  };






  constructor(private resultClasification: ClasificationService,
    private variableService: VariableService,
    private dataService: DataService,
    private regionService: RegionService) {


    this.getCantons();
    this.clasification = this.resultClasification.listClasification(this.filters).subscribe((data) => {

      for (const clasification of data.data) {
        if (clasification.name === "Corona Virus") {
          // console.log(clasification._id);
          this.getIdVaribale(variableService, dataService, clasification._id);
          this.getVariables(clasification._id);


        }

      }

    });










    // console.log(this.dataMapa);

    this.cities = this.data2;


    setTimeout(() => {



      this.chartOptionsMap = {
        chart: {
          map: catones
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
        series: [{
          data: this.dataMapa,
          keys: ['id', 'value'],
          joinBy: 'id',
          name: 'Casos confirmados',
          states: {
            hover: {
              color: '#a4edba'
            }
          },
          dataLabels: {
            enabled: true,
            format: '{point.properties.name}'
          }
        }]
      };

    }, 2000);


    const self = this;

    this.chartCallback = chart => {
      self.chart = chart;
    };

    HC_exporting(Highcharts2);
    HC_export(Highcharts2);












  }

  ngOnInit() {


  }



  getCantons() {

    this.regionService.listRegionsPublic(this.filters, this.model).subscribe((data) => {

      this.cantons = data.data;
    });

  }


  getVariables(idClasification: string) {

    this.variableService.getVariablesByClasification(idClasification).subscribe((data) => {
      this.varibales2 = data.data;

    });

  }

  getSelects() {

    console.log(this.selectedCantons);


  }

  getSelectVariable() {

    console.log(this.selectVariable._id);
    this.getData(this.selectVariable._id);

  }

  getData(idSelectVariable: string) {

    this.dataService.listDatasPublic(this.filters, idSelectVariable).subscribe((data) => {
      console.log(data);

      for (const dataCovid of data.data) {

        let dataCovi = {
          data: [Number(dataCovid.value)],
          name: dataCovid.obj_Canton.name


        };


        let dataMap: [string, number] = [
          dataCovid.obj_Canton.code,
          Number(dataCovid.value)
        ];

        this.dataHigcharts.push(dataCovi);
        this.dataMapa.push(dataMap);


      }

    });

  }










  async getIdVaribale(variableService: VariableService, dataservice: DataService, id: string) {

    this.varibales = await variableService.getVariablesByClasification(id).subscribe((data) => {
      this.getDataVaribale(dataservice, data.data[0]._id);

    });

  }

  async getDataVaribale(dataService: DataService, id: string) {

    this.data = await dataService.listDatasPublic(this.filters, id).subscribe((data) => {


      for (const dataCovid of data.data) {



        //console.log(dataCovid);
        let dataSets = {
          name: dataCovid.obj_Canton.name,
          id: dataCovid.obj_Canton.code


        };

        let dataCovi = {
          data: [Number(dataCovid.value)],
          name: dataCovid.obj_Canton.name


        };


        let dataMap: [string, number] = [
          dataCovid.obj_Canton.code,
          Number(dataCovid.value)
        ];


        this.rangeValues.push(dataCovid.date);


        this.dataMapa.push(dataMap);
        this.label.push(String(dataCovid.year));
        this.data2.push(dataSets);
        this.dataHigcharts.push(dataCovi);

        //  console.log(dataSets);


      }

      // console.log(this.rangeValues);
      this.createDateRange();
      this.graficarHigcharts();


    });







  }



  graficarHigcharts() {


    let dates: Date[] = [];
    for (const date of this.dateRange) {
      let date2: Date = date.toDateString();
      dates.push(date2);
    }

    console.log(dates);
    console.log(this.dataHigcharts);
    console.log(this.label);



    //HIGCHARTS

    setTimeout(() => {

      this.highcharts = Highcharts;
      HC_exporting(Highcharts);
      HC_export(Highcharts);
      this.chartOptions6 = {
        chart: {
          type: "column"
        },
        title: {
          text: "Casos confirmados de covid"
        },
        xAxis: {
          categories: dates
        },
        crosshair: true,
        yAxis: {
          title: {
            text: "Casos Confirmados"
          }
        },
        series: this.dataHigcharts
      };




    }, 2000);





  }


  createDateRange() {

    const dates: Date[] = [];


    let dateRange = [];
    dateRange = this.rangeValues.filter((date, index) => {
      return this.rangeValues.indexOf(date) === index;
    });

    for (const dateString of dateRange) {
      let date = new Date(dateString);
      let day = date.getUTCDate();
      let year = date.getUTCFullYear();
      let month = date.getUTCMonth();
      let dateStr = new Date(year, month, day);
      //console.log(dateStr);

      dates.push(dateStr);

    }


    // console.log('Perro', dates);


    this.loadDate(dates);


  }


  loadDate(dates: Date[]) {


    //let dateRange: Date[] = [];

    this.dateRange = dates.sort((a, index) => {
      return a - index
    });

    console.log('Perro', this.dateRange);


    // console.log(dateRange);


    this.value = this.dateRange[0].getTime();
    // console.log(this.value);


    this.options = {

      stepsArray: this.dateRange.map((date: Date) => {
        return { value: date.getTime() };
      }),
      translate: (value: number, label: LabelType): string => {
        return new Date(value).toDateString();
      }
    };



  }

  sliderChange(e) {

    let values: number[] = [];
    this.dateRange.map((date: Date) => {

      if (date <= new Date(e.value)) {
        let value: number = date.getTime();
        values.push(value);
      }
    });


    let dates: Date[] = [];
    for (const dateNumber of values) {

      let date: Date = new Date(dateNumber).toDateString();
      dates.push(date);
      console.log(date);

    }

    this.dates = dates;

    console.log(this.dates);

  }



}
