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


import Color_Axis from 'highcharts/modules/coloraxis';
import * as Legend from '../../../../../assets/js/legend/legend.js';


//map
//import catones from '../../../../../assets/geojson/json';
import { RegionService } from '../../../../core/services/region.service';
import { Region } from 'src/app/core/models/regions.model';
import { Variable } from 'src/app/core/models/variable.model';

const catones: any = require('../../../../../assets/geojson/cantones.json');

import { Options, LabelType } from 'ng5-slider';
import { Data } from '@angular/router';
import { COLORS } from '../../../../core/const/colors.data';

import Streamgraph from 'highcharts/modules/streamgraph';


import Stock from 'highcharts/modules/stock';
import { stringify } from 'querystring';
import { AlignCenter } from 'angular-feather/icons';
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
    limit: 1000,
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
  dateStreamgraph: number;



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




  dateRange: Date[];
  value: number;
  options: Options = {
    ceil: 0,
    floor: 0
  };



  dataCovid: any = [];
  dataFinal: any = [];
  dataPrueba: any = [];




  constructor(private resultClasification: ClasificationService,
    private variableService: VariableService,
    private dataService: DataService,
    private regionService: RegionService) {

    this.highcharts3 = Highcharts3;
    Streamgraph(Highcharts3);
    Color_Axis(Highcharts3);

    // this.highcharts = Highcharts;
    this.dateStreamgraph = 1;

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
      //console.log(this.cantons);

      /* this.dataService.getData().subscribe((data1) => {
         this.dataCovid = data1;
         this.saveDataCovid(this.cantons, this.dataCovid);
 
       });*/


    });
  }

  saveDataCovid(cantons: Region[], dataCovid: any[]) {




    for (const data of dataCovid) {

      //console.log(date[0]);

      let dataF = {
        description: 'Datos confirmados del covid-19',
        value: '',
        year: '2020',
        id_Canton: '',
        id_Variable: '5ee17c6c522d5f001755b034',
        date: ''
      };



      for (const canton of cantons) {
        //  console.log(canton.name);

        if (canton.code === data.id_region) {
          let date = data.date.split(' ');

          dataF.id_Canton = canton._id;
          dataF.value = data.value;
          dataF.date = date[0];
          //console.log(data.id_region);
          /*this.dataService.addData(data).subscribe((data2) => {
             console.log(data2); 
           });*/

        }


      }
      // console.log(dataF);
      this.dataFinal.push(dataF);


    }

    this.addData();

    /*
        for (const canton of cantons) {
          if (canton.code === dataCovid.id_region) {
    
            data.id_Canton = canton._id;
            data.value = dataCovid.value;
            data.date = date[0];
    
          }
    
    
    
        }
        */




    //console.log(cantons);
    //console.log(dataCovid.id_region);


  }


  addData() {

    console.log(this.dataFinal);

    this.dataPrueba.push(this.dataFinal[0]);
    this.dataPrueba.push(this.dataFinal[1]);

    //console.log(this.dataPrueba);


    /* for (let index = 0; index < this.dataFinal.length; index++) {
       //console.log(this.dataPrueba[index]);
 
       setTimeout(() => {
         this.dataService.addData(this.dataFinal[index]).subscribe((data2) => {
           console.log(data2);
         });
       }, 3000);
 
     }*/









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
        // console.log(info.date);

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

        this.dataHigcharts = dataHighchartsFinal.sort((a, b) => { return b.data[0] - a.data[0] });
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

    //console.log('Numeros', this.dateStringAll);

    //console.log(this.cantons);



    this.dataService.listDatasPublic(this.filters, idSelectVariable).subscribe((data) => {






      // console.log(dateStr);

      for (const dataCovid of data.data) {




        let dataStregraph = {
          name: '',
          data: [],
          date: [],
          range: []
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

        for (let index = 0; index < this.dateStringAll.length; index++) {

          if (this.dateStringAll[index] === dateStr) {

            dataStregraph.data.push(Number(dataCovid.value));
            dataStregraph.date.push(dateStr);
            dataStregraph.range.push(index);

          } else {
            dataStregraph.data.push(0);
            dataStregraph.date.push(this.dateStringAll[index]);
            dataStregraph.range.push(index);


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
    console.log(e);

    let datesString = [];
    this.selectDate = e.value;
    let selectDate = new Date(this.selectDate).toDateString();
    datesString.push(selectDate);
    this.dateString = datesString;

    this.getData(this.selectVariable._id);

    for (let index = 0; index < this.dateRange.length; index++) {

      if (this.dateRange[index].getTime() === e.value) {
        console.log(this.dateRange[index].getTime(), index + 1);
        this.dateStreamgraph = index + 1;
        console.log(this.dateStreamgraph);
        this.getDataStreamgraph(this.selectVariable._id);

      }

    }
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

    console.log(this.dataHigcharts);
    // console.log(this.dateString);

    //HIGCHARTS


    this.highcharts = Highcharts;


    HC_exporting(Highcharts);
    HC_export(Highcharts);
    Color_Axis(Highcharts);

    this.chartOptions6 = {
      chart: {
        type: "column",

      },
      title: {
        text: "Casos confirmados de covid-19"
      },
      xAxis: {
        categories: this.dateString,

      },
      colorAxis: {

        minColor: '#ffeda0',
        maxColor: '#bd0026',

      },
      yAxis: {
        title: {
          text: "Casos Confirmados"
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        enabled: false,
        crosshairs: true
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            overflow: 'none',
            crop: true,
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderColor: 'rgba(0,0,0,0.9)',
            color: 'rgba(255,255,255,0.75)',
            borderWidth: .5,
            borderRadius: 5,
            y: -4,
            style: {
              fontFamily: 'Helvetica, sans-serif',
              fontSize: '7px',
              fontWeight: '300',
              textShadow: 'none'

            },
            formatter: function () {
              return `<p>  ${this.series.name} </p>`;
            }
          }
        }
      },
      series: this.dataHigcharts

    };

    this.updateDemo = true;

    // colorsLegend(Highcharts);


  }

  graficHighmap() {

    //console.log(this.dataMapa);

    this.chartOptionsMap = {
      chart: {
        map: catones,
        events: {
          load: function () {
            setTimeout(() => {
              this.mapZoom(0.7, -2, 2);
            }, 0);

          }
        }
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
          format: '{point.properties.name}',
          style:
          {
            font: 'normal 1px Verdana, sans-serif'
          }
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

    // console.log('Letras', this.dataStreamGraphFinal);

    this.chartOptionsStreamgraph = {
      chart: {

        type: "streamgraph",
        zoomType: 'x',
        events: {
          afterSetExtremes: function () {
            console.log(this.getExtremes());
          }
        }

      },
      title: {
        text: "Casos confirmados de covid-19"
      },
      xAxis: {
        maxPadding: 0,
        type: 'categories',
        min: this.dateStreamgraph,
        max: this.dateStreamgraph,
        crosshair: true,
        categories: this.dateStringAll,
        labels: {
          align: 'left',
          reserveSpace: false,
          rotation: 270
        },
        lineWidth: 0,
        margin: 20,
        tickWidth: 0,
        events: {
          setExtremes: function (e) {


            console.log(e);


          },

          afterSetExtremes: function () {
            console.log(this.getExtremes());
          }
        },

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
    };



  }


}







