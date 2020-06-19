import { Component, OnInit } from '@angular/core';
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
import { Data } from '@angular/router';





interface City {
  name: string;
  id: string;

}




@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.scss']
})
export class CovidComponent implements OnInit {

  idClasification: string;
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

  selectDate: number;

  dates: Date[] = [];

  dateString: string[] = [];





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
  updateDemo: boolean;



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

    this.updateDemo = false;
    this.getCantons();
    this.getClasification();

  }


  getClasification() {

    this.resultClasification.listClasification(this.filters).subscribe((data) => {

      let idClasification;
      for (const clasification of data.data) {
        if (clasification.name === "Corona Virus") {

          //console.log(this.idClasification);
          this.getVariables(clasification._id);


        }

      }



    });


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
      this.selectVariable = this.varibales2[0];
      this.getDatesVaribale(this.selectVariable);

    });

  }


  getDatesVaribale(varibable: Variable) {


    let dataCovid = [];
    const dateRanges = [];
    this.dataService.listDatasPublic(this.filters, varibable._id).subscribe((data) => {

      dataCovid = data.data;
      for (const info of dataCovid) {
        dateRanges.push(info.date);
      }

      this.rangeValues = dateRanges;
      this.createDateRange();
      this.getData(varibable._id);

    });



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

      dates.push(dateStr);

    }

    this.loadDate(dates);


  }


  loadDate(dates: Date[]) {


    this.dateRange = dates.sort((a, index) => {
      return a.getTime() - index.getTime();
    });

    this.options = {

      stepsArray: this.dateRange.map((date: Date) => {
        return { value: date.getTime() };
      }),
      translate: (value: number, label: LabelType): string => {
        return new Date(value).toDateString();
      }
    };


  }

  getData(idSelectVariable: string) {

    this.dataService.listDatasPublic(this.filters, idSelectVariable).subscribe((data) => {

      let datesString = [];

      if (!this.selectDate) {
        this.selectDate = this.dateRange[0].getTime();
        let selectDate = new Date(this.selectDate).toDateString();
        datesString.push(selectDate);
        this.dateString = datesString;
      }

      let dataHigcharts = [];
      let dataHighmap = [];

      for (const dataCovid of data.data) {


        let date: Date = new Date(dataCovid.date);
        let day = date.getUTCDate();
        let year = date.getUTCFullYear();
        let month = date.getUTCMonth();
        let dateStr = new Date(year, month, day).getTime();


        if (this.selectDate === dateStr) {


          // console.log(dataCovid);


          let dataCovi = {
            data: [Number(dataCovid.value)],
            name: dataCovid.obj_Canton.name


          };


          let dataMap: [string, number] = [
            dataCovid.obj_Canton.code,
            Number(dataCovid.value)
          ];



          dataHigcharts.push(dataCovi);
          dataHighmap.push(dataMap);



        }


      }

      /*let selectCantos = ;
      let dataSmall = [...dataHigcharts].sort((a, b) => b.data[0] - a.data[0]).slice(0, 1);
      console.log('ALTO', topValues);*/

      if (!this.selectedCantons) {

        let cantonSelectInicial = [];

        for (const dataHih of dataHigcharts) {



          for (const canton of this.cantons) {
            if (canton.name === dataHih.name) {


              cantonSelectInicial.push(canton);


            }

          }

        }

        this.selectedCantons = cantonSelectInicial;



      }

      if (this.selectedCantons) {

        let dataHighchartsFinal = [];
        let dataHighmapFinal = [];

        for (const dataCovidHighcharts of dataHigcharts) {

          for (const canton of this.selectedCantons) {

            if (canton.name === dataCovidHighcharts.name) {

              dataHighchartsFinal.push(dataCovidHighcharts);


            }

          }

        }


        for (const dataCovidHighmap of dataHighmap) {


          for (const canton of this.selectedCantons) {


            if (canton.code === dataCovidHighmap[0]) {


              dataHighmapFinal.push(dataCovidHighmap);


            }

          }

        }

        this.dataHigcharts = dataHighchartsFinal;
        this.dataMapa = dataHighmapFinal;
      }

      this.graficarHigcharts();
      this.graficHighmap();



    });

  }


  getSelectVariable() {

    this.getDatesVaribale(this.selectVariable);

  }


  getSelects() {

    this.getData(this.selectVariable._id);


  }
  sliderChange(e) {
    //console.log(e.value);

    let datesString = [];
    this.selectDate = e.value;
    let selectDate = new Date(this.selectDate).toDateString();
    datesString.push(selectDate);
    this.dateString = datesString;

    this.getData(this.selectVariable._id);
    // console.log(this.selectDate);

    //OBTAIN DATE RANGE 
    /* let values: number[] = [];
     this.dateRange.map((date: Date) => {
   
       if (date <= new Date(e.value)) {
         let value: number = date.getTime();
         values.push(value);
       }
   
     });
   
   
     let dates: Date[] = [];
     for (const dateNumber of values) {
   
       let date: Date = new Date(dateNumber);
       dates.push(date);
       console.log(date);
   
     }
   
     this.dates = dates;
   
    // console.log(this.dates);*/

  }




  graficarHigcharts() {

    // console.log(this.dataHigcharts);
    // console.log(this.dateString);

    //HIGCHARTS



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
        categories: this.dateString
      },
      yAxis: {
        title: {
          text: "Casos Confirmados"
        }
      },
      series: this.dataHigcharts
    };

    this.updateDemo = true;


  }

  graficHighmap() {

    //console.log(this.dataMapa);

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

    const self = this;

    this.chartCallback = chart => {
      self.chart = chart;
    };

    HC_exporting(Highcharts2);
    HC_export(Highcharts2);


  }






}
