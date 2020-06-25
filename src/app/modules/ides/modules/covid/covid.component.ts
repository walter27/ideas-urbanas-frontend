import { Component, OnInit } from '@angular/core';
import { ClasificationService } from '../../../../core/services/clasification.service';
import { VariableService } from '../../../../core/services/variable.service';
import { DataService } from '../../../../core/services/data.service';
import * as Highcharts from 'highcharts';
import * as Highcharts2 from 'highcharts/highmaps';
import * as Highcharts3 from 'highcharts';


import HC_exporting from 'highcharts/modules/exporting';
import HC_export from 'highcharts/modules/export-data';

import { NgForm, FormGroup } from '@angular/forms';
import more from 'highcharts/highcharts-more';


//map
//import catones from '../../../../../assets/geojson/json';
import { RegionService } from '../../../../core/services/region.service';
import { Region } from 'src/app/core/models/regions.model';
import { Variable } from 'src/app/core/models/variable.model';

const catones: any = require('../../../../../assets/geojson/geojson_cantones.json');

import { Options, LabelType } from 'ng5-slider';
import { Data } from '@angular/router';
import { COLORS } from '../../../../core/const/colors.data';

import Streamgraph from 'highcharts/modules/streamgraph';


import Stock from 'highcharts/modules/stock';
import { stringify } from 'querystring';
//import Wheel from '../plugins/wheel-event';


Stock(Highcharts);
//Wheel(Highcharts);

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
  dateStringAll: string[] = [];


  Streamgraph: any;
  chartOptionsStreamgraph: any = {};
  chartConstructor2 = 'streamgraph';




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
  dataStreamGraphFinal: any = [];


  //highcharts = Highcharts;
  chartOptions: any = {};
  chartOptions6: any = {};

  highcharts: any;
  highcharts3: any;


  cities: City[];

  selectedCities: City[];


  //Mapa
  dataMapa: any[] = [];


  form: FormGroup;


  chart;
  chartCallback;
  title = 'app';
  updateFromInput = false;
  Highcharts: any;
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


  more: any;





  constructor(private resultClasification: ClasificationService,
    private variableService: VariableService,
    private dataService: DataService,
    private regionService: RegionService) {

    this.highcharts3 = Highcharts3;
    Streamgraph(Highcharts3);
    this.Highcharts = Highcharts2;
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
      this.getDataStreamgraph(varibable._id);

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


      let datesStringFinal = [];
      datesStringFinal.push('');

      for (const dateString of this.dateRange) {

        let dateStringFinal = dateString.getTime();
        let selectDate = new Date(dateStringFinal).toDateString();
        datesStringFinal.push(selectDate);
        this.dateStringAll = datesStringFinal;



      }



      let dataHigcharts = [];
      let dataHighmap = [];
      let dataStreangraph = [];


      for (const dataCovid of data.data) {


        let date: Date = new Date(dataCovid.date);
        let day = date.getUTCDate();
        let year = date.getUTCFullYear();
        let month = date.getUTCMonth();
        let dateStr = new Date(year, month, day).getTime();

        let dataCovid2 = {
          data: [Number(dataCovid.value)],
          name: dataCovid.obj_Canton.name


        };

        dataStreangraph.push(dataCovid2);

        //  console.log(dataCovid);

        if (this.selectDate === dateStr) {




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

      // console.log(this.dataStreamGraph);


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


  getDataStreamgraph(idSelectVariable: string) {

    let datesStringFinal = [];
    let dataStreamGraph = [];
    let dataStreamGraphCopy = [];
    datesStringFinal.push('');

    for (const dateString of this.dateRange) {

      let dateStringFinal = dateString.getTime();
      let selectDate = new Date(dateStringFinal).toDateString();
      datesStringFinal.push(selectDate);
      this.dateStringAll = datesStringFinal;



    }
    //console.log(this.cantons);



    this.dataService.listDatasPublic(this.filters, idSelectVariable).subscribe((data) => {






      // console.log(dateStr);

      for (const dataCovid of data.data) {




        let dataStregraph = {
          name: '',
          data: [],
          date: []
        };

        dataStregraph.name = dataCovid.obj_Canton.name;

        /* const userExists = dataStreamGraph.some(user => user.name = dataStregraph.name);
         if (userExists) {
           console.log(dataStregraph);
           // dataStreamGraphCopy.push(dataStregraph);
 
         } else {
 
           /*for (const dataRepeat of dataStreamGraph) {
             for (let index = 0; index < dataRepeat.date.length; index++) {
 
               if (dataStregraph.date[index] === dataRepeat.date[index]) {
                 dataRepeat.data[index].push(dataStregraph.data[index]);
 
               }
 
             }
             // console.log(dataRepeat);
 
           }*/

        // }

        /* if (!userExists) {
           console.log(dataStregraph);
 
         }*/




        let date: Date = new Date(dataCovid.date);
        let day = date.getUTCDate();
        let year = date.getUTCFullYear();
        let month = date.getUTCMonth();
        let dateStr = new Date(year, month, day).toDateString();

        for (const dateRange of this.dateStringAll) {


          if (dateRange === dateStr) {

            dataStregraph.data.push(Number(dataCovid.value));
            dataStregraph.date.push(dateStr);

          } else {
            dataStregraph.data.push(0);
            dataStregraph.date.push(dateRange);

          }


        }

        // console.log(dataStregraph);

        if (!dataStreamGraph.some(user => user.name === dataStregraph.name)) {

          dataStreamGraphCopy.push(dataStregraph);

        } else {

          for (let i = 0; i < dataStreamGraphCopy.length; i++) {

            if (dataStreamGraphCopy[i].name === dataStregraph.name) {
              //console.log(dataStreamGraphCopy[i], i);
              // console.log(Object.assign({}, dataStreamGraphCopy[i], dataStregraph));

              for (let j = 0; j < dataStreamGraphCopy[i].data.length; j++) {

                //dataStreamGraphCopy[i].data[j];

                if (dataStregraph.data[j] !== 0) {
                  // console.log(dataStregraph.data[j]);
                  // console.log(dataStreamGraphCopy[i].data[j], j);
                  dataStreamGraphCopy[i].data[j] = dataStregraph.data[j];


                }






              }

            }
            // console.log(dataStreamGraphCopy[i].date[j]);
            // console.log(dataStregraph.data[j],j);





            // }




          }
          //console.log(dataStregraph);


        }

        dataStreamGraph.push(dataStregraph);


      }

      this.dataStreamGraphFinal = dataStreamGraphCopy;

      this.createStreamgraph();


      // console.log(dataStreamGraphCopy);

      //console.log(dataStreamGraphCopy);




      /*for (const dataStreamgraph of dataStreamGraph) {
        for (const dateDataStreamgraph of dataStreamgraph.date) {
          for (const dateRange of this.dateStringAll) {

            if (dateDataStreamgraph !== dateRange ) {
              dataStreamgraph.data.push(0);

            }
          }



        }

       // console.log(dataStreamgraph);


      }*/




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

    //console.log(this.dataHigcharts);
    // console.log(this.dateString);

    //HIGCHARTS


    this.highcharts = Highcharts;

    HC_exporting(Highcharts);
    HC_export(Highcharts);
    // Streamgraph(Highcharts);
    this.chartOptions6 = {
      chart: {
        type: "column"
      },
      title: {
        text: "Casos confirmados de covid-19"
      },
      xAxis: {
        categories: this.dateString
      },
      yAxis: {
        title: {
          text: "Casos Confirmados"
        }
      },
      series: this.dataHigcharts,
      colorAxis: {
        minColor: '#c6e48b',
        maxColor: '#196127',
        min: 1,
        max: 6,
        gridLineWidth: 0
      }
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


  createStreamgraph() {

    const colors = Highcharts.getOptions().colors;
    console.log(this.dataStreamGraphFinal);


    this.chartOptionsStreamgraph = {
      chart: {

        type: "streamgraph",
        zoomType: 'x'

      },
      title: {
        text: "Casos confirmados de covid-19"
      },
      xAxis: {
        maxPadding: 0,
        type: 'category',
        crosshair: true,
        categories: this.dateStringAll,
        labels: {
          align: 'left',
          reserveSpace: false,
          rotation: 270
        },
        lineWidth: 0,
        margin: 20,
        tickWidth: 0
      },
      yAxis: {
        visible: false,
        startOnTick: false,
        endOnTick: false
      },
      legend: {
        enabled: false
      },

      plotOptions: {
        series: {
          label: {
            minFontSize: 5,
            maxFontSize: 15,
            style: {
              color: 'rgba(255,255,255,0.75)'
            }
          }
        }
      },

      series: this.dataStreamGraphFinal,
      exporting: {
        sourceWidth: 800,
        sourceHeight: 600
      }
    };


    //.xAxis[0].setExtremes('1924 Chamonix', '1928 St. Moritz');



  }







}
