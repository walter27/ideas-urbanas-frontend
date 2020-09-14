import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClasificationService } from '../../../../core/services/clasification.service';
import { VariableService } from '../../../../core/services/variable.service';
import { DataService } from '../../../../core/services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { RegionService } from '../../../../core/services/region.service';
import { Region } from 'src/app/core/models/regions.model';
import { Variable } from 'src/app/core/models/variable.model';
import { Options, LabelType } from 'ng5-slider';
import { Observable } from 'rxjs';
import { Data } from '@angular/router';
import { ResultList } from 'src/app/core/models/resultList.model';
import { ItemDropdown } from 'src/app/core/models/item-dropdown.model';
let { titleCase }: any = require('../../../../core/utils/utils');

@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.scss']
})

export class CovidComponent implements OnInit, OnDestroy {

  model = 'Canton';
  filters = {
    page: 0,
    limit: 2000,
    ascending: true,
    sort: 'value'
  };
  cantons: Region[] = [];
  selectedCantons: Region[] = [];

  varibales2: Variable[];
  selectVariable: Variable;

  selectDate: number;
  dateString: string[] = [];
  dateStringAll: string[] = [];
  dataMapa: any = [];


  minStreamgraph: number;
  maxStreamgraph: number;
  maxExport: number;

  rangeValues: any = [];

  dataHigcharts: any = [];
  dataStreamGraphFinal: any = [];

  dateRange: Date[];
  value: number;
  options: Options = {
    ceil: 0,
    floor: 0
  };

  result$: Data;


  minScroll: number;
  maxScroll: number;


  dataFinal: any = [];
  dataPrueba: any = [];

  loading = false;
  optionsDate: any = {};

  prueba: string;
  returnValue: Observable<string>;

  resultVariable$: Observable<ResultList<Variable>>;
  keysVariable: any[];
  languajeDate: string;




  constructor(
    private resultClasification: ClasificationService,
    private variableService: VariableService,
    private dataService: DataService,
    private regionService: RegionService,
    private translateService: TranslateService) {
  }


  ngOnInit() {

    this.minScroll = 0;
    this.maxScroll = 6;
    this.getCantons();
    this.getClasification();
    this.optionsDate = { year: 'numeric', month: 'short', day: 'numeric' };

  }




  ngOnDestroy() {

    let dataTop = [...this.dataHigcharts].sort((a, b) => b.data[0] - a.data[0]).slice(0, 6);
    let cantonsTop = [];

    for (const canton of this.selectedCantons) {

      for (const cantontop of dataTop) {

        if (canton.name === cantontop.name) {

          cantonsTop.push(canton);

        }
      }

    }

    let cantonsNotop = this.selectedCantons.filter(canton => !cantonsTop.includes(canton));

    cantonsNotop.forEach(cantonNoTop => {
      cantonNoTop.covid = false;



      setTimeout(() => {
        this.regionService.editRegion(cantonNoTop, cantonNoTop._id, this.model).subscribe(res => { });
      }, 1);

    });

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

  scrollLeft() {
    /*console.log('Izuierda');
    this.minScroll -= 6;
    this.maxScroll -= 6;*/

    this.result$.forEach(element => {
      console.log(element.data);

    });

    //console.log('OBSERVABLE', this.result$.data);

  }

  scrollRigt() {
    this.minScroll += 6;
    this.maxScroll += 6;
  }


  getCantons() {


    /*this.dataService.getData().subscribe((data1) => {
      this.dataCovid = data1;
      console.log(data1);

      //this.saveDataCovid(this.cantons, this.dataCovid);

    });*/


    this.regionService.listRegions(this.filters, this.model).subscribe((data) => {



      this.cantons = data.data.sort((a, b) => {

        return (a.covid === b.covid) ? 0 : a.covid ? -1 : 1;
      });

      /*let dataCovid: any;
      this.dataService.getData().subscribe((data1) => {
        dataCovid = data1;

        //console.log(dataCovid);

        this.saveDataCovid(this.cantons, dataCovid);

      });*/


    });
  }

  saveDataCovid(cantons: Region[], dataCovid: any[]) {

    for (const data of dataCovid) {

      let dataF = {
        description: 'Número diario de personas fallecidas',
        value: '',
        year: '2020',
        id_Canton: '',
        id_Variable: '5f2354627bce7c1b149c118e',
        date: ''
      };



      for (const canton of cantons) {
        //  console.log(canton.name);

        if (canton.code === data.id_region) {
          let date = data.date.split(' ');

          //console.log(date);

          dataF.id_Canton = canton._id;
          dataF.value = data.value;
          if (date[0].includes('/')) {
            //console.log(data.date);
            //let data = data.date.replace(/\//g, '-');
            let dateg = date[0].split('/');
            dataF.date = `${dateg[2]}-${dateg[1]}-${dateg[0]}`;
            // console.log('SLAHS', dataF.date);
          } else {
            // console.log('sSIN SLAHS');

            dataF.date = date[0];
          }
          /*this.dataService.addData(data).subscribe((data2) => {
              console.log(data2); 
            });*/

        }


      }
      //console.log(dataF);
      this.dataFinal.push(dataF);


    }

    //this.addData();

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


    //this.dataPrueba.push(this.dataFinal[0]);
    //this.dataPrueba.push(this.dataFinal[1]);
    //this.dataPrueba.push(this.dataFinal[8]);

    //console.log(this.dataPrueba);
    /* this.dataService.addData(this.dataPrueba[0]).subscribe((data2) => {
       console.log(data2);
     });*/


    for (let index = 0; index < this.dataFinal.length; index++) {

      if (index > 28730 && index <= 30719) {
        //console.log(this.dataFinal[index], index);

        setTimeout(() => {
          this.dataService.addData(this.dataFinal[index]).subscribe((data2) => {
            console.log(data2, index);
          });
        }, 2000);

      }


    }

    //console.log("terminado..");

  }

  traslate() {



    this.translateService.stream(this.keysVariable).subscribe(values => {

      let variables = [];
      let lang = this.translateService.currentLang;


      Object.keys(values).forEach((key, i) => {


        this.varibales2.forEach((variable, j) => {

          if (i === j) {
            variable.name = values[key];
            variables.push(variable)
          }


        });



      })

      this.varibales2 = variables;

      if (lang === 'es') {

        this.languajeDate = 'es-ES';
        this.getData(this.selectVariable._id);

      }

      if (lang === 'en') {
        this.languajeDate = 'en-US';
        this.getData(this.selectVariable._id);

      }

    })





  }


  getVariables(idClasification: string) {


    this.keysVariable = [];



    this.variableService.getVariablesByClasification(idClasification).subscribe((data) => {


      data.data.forEach(variable => {

        this.keysVariable.push(variable.name);

      });




      this.varibales2 = data.data;
      this.selectVariable = this.varibales2[0];
      this.traslate();
      this.getData(this.selectVariable._id);

    });

  }



  getData(idSelectVariable: string) {

    let dateRanges = [];

    this.dataService.listDatasCovid(this.filters, idSelectVariable).subscribe(data => {

      for (const info of data.data) {
        dateRanges.push(info.date);

      }
      this.rangeValues = dateRanges;
      this.createDateRange();

    });

    this.result$ = this.dataService.listDatasCovid(this.filters, idSelectVariable);

    /* setTimeout(() => {
       
     }, 2000);*/

  }


  /* getDatesVaribale(varibable: Variable) {
 
     let dateRanges = [];
     this.dataService.listDatasCovid(this.filters, varibable._id).subscribe((data) => {
 
       dataCovid = data.data;
       for (const info of data.data) {
         dateRanges.push(info.date);
         // console.log(info.date);
 
       }
 
       this.rangeValues = dateRanges;
       this.createDateRange();
       this.getData(varibable._id);
       //CARGAR INICLAMENTE LOS CANTONES 
       setTimeout(() => {
         this.filterData();
         this.filterDataStreamgraph();
       }, 2000);
 
     });
 
 
 
   }*/


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
        return titleCase(new Date(value).toLocaleDateString(this.languajeDate, this.optionsDate));
      }
    };


    this.filterData();
    this.filterDataStreamgraph();


  }


  filterData() {



    let datesString = [];
    if (!this.selectDate || this.selectDate === 0) {
      this.selectDate = this.dateRange[0].getTime();

      let selectDate = titleCase(new Date(this.selectDate).toLocaleDateString(this.languajeDate, this.optionsDate));
      datesString.push(selectDate);
      this.dateString = datesString;

    }

    let datesStringFinal = [];
    datesStringFinal.push('');

    for (const dateString of this.dateRange) {

      let dateStringFinal = dateString.getTime();
      let selectDate = titleCase(new Date(dateStringFinal).toLocaleDateString(this.languajeDate, this.optionsDate));
      datesStringFinal.push(selectDate);
    }
    this.dateStringAll = datesStringFinal;

    let dataHigcharts = [];
    let dataHighmap = [];
    let dataStreangraph = [];

    this.result$.forEach(element => {
      //console.log('DATAOBSERVABLE', dataCovidlocal);


      for (const dataCovid of element.data) {

        //console.log(dataCovid);


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

          // console.log(dateStr);



          let dataCovi = {
            data: [Number(dataCovid.value)],
            name: dataCovid.obj_Canton.name,
            date: titleCase(new Date(dateStr).toLocaleDateString(this.languajeDate, this.optionsDate))


          };


          let dataMap: [string, number] = [
            dataCovid.obj_Canton.code,
            Number(dataCovid.value)
          ];



          dataHigcharts.push(dataCovi);
          dataHighmap.push(dataMap);



        }


      }

      this.loadData(dataHigcharts, dataHighmap);
    });




  }

  loadData(dataHigcharts: any, dataHighmap: any) {



    if (!this.selectedCantons || this.selectedCantons.length === 0) {



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



  }


  filterDataStreamgraph() {

    let datesStringFinal = [];
    let dataStreamGraph = [];
    let dataStreamGraphCopy = [];
    datesStringFinal.push('');

    for (const dateString of this.dateRange) {

      let dateStringFinal = dateString.getTime();
      let selectDate = titleCase(new Date(dateStringFinal).toLocaleDateString(this.languajeDate, this.optionsDate));
      datesStringFinal.push(selectDate);
    }
    this.dateStringAll = datesStringFinal;
    if (this.selectDate === this.dateRange[0].getTime()) {
      this.minStreamgraph = 0;
      this.maxStreamgraph = this.dateRange.length;
      this.maxExport = this.dateRange.length;
    }

    this.result$.forEach(element => {

      for (const dataCovid of element.data) {


        let dataStregraph = {
          name: '',
          data: [],
          date: [],
          range: []
        };

        dataStregraph.name = dataCovid.obj_Canton.name;

        let date: Date = new Date(dataCovid.date);
        let day = date.getUTCDate();
        let year = date.getUTCFullYear();
        let month = date.getUTCMonth();
        let dateStr = titleCase(new Date(year, month, day).toLocaleDateString(this.languajeDate, this.optionsDate));

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

        if (!dataStreamGraph.some(dataStreamgraph => dataStreamgraph.name === dataStregraph.name)) {

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

          }

        }

        //console.log(dataStregraph);
        //console.log(dataStreamGraphCopy);

        dataStreamGraph.push(dataStregraph);


      }
      this.loadDataStreamGraph(dataStreamGraphCopy);

    });




  }

  loadDataStreamGraph(dataStreamGraphCopy: any) {

    if (this.selectedCantons) {

      let dataStreamGraphCanton = [];

      for (const selectCanton of this.selectedCantons) {


        for (const dataStreamgraphCanton of dataStreamGraphCopy) {
          if (selectCanton.name === dataStreamgraphCanton.name) {

            dataStreamGraphCanton.push(dataStreamgraphCanton);

          }

        }
      }
      this.dataStreamGraphFinal = dataStreamGraphCanton;
    }

  }




  getSelectVariable() {


    this.selectDate = 0;
    this.options = {
      ceil: 0,
      floor: 0
    };
    this.selectedCantons = [];
    this.getData(this.selectVariable._id);
  }

  getSelects(e) {

    // console.log(e.itemValue);
    //console.log(this.selectedCantons);

    if (this.selectedCantons) {

      /*this.selectedCantons.forEach(cantonSelected => {

        //console.log(cantonSelected.name, cantonSelected.covid);

        let body = {
          covid: true,
          code: cantonSelected.code,
          id_Provincia: cantonSelected.obj_Provincia._id,
          name: cantonSelected.name,
          active: cantonSelected.active
        };
        this.regionService.editRegion(body, cantonSelected._id, this.model).subscribe(res => {
          // console.log('TRUE', res);


        });
      });*/


      if (!this.selectedCantons.includes(e.itemValue)) {


        let body = {
          covid: false,
          code: e.itemValue.code,
          id_Provincia: e.itemValue.obj_Provincia._id,
          name: e.itemValue.name,
          is_intermediate: e.itemValue.is_intermediate,
          color: e.itemValue.color,
          indexes: e.itemValue.indexes

        };
        this.regionService.editRegion(body, e.itemValue._id, this.model).subscribe(res => {
          //console.log('false', res);

        });
      } else {
        let body = {
          covid: true,
          code: e.itemValue.code,
          id_Provincia: e.itemValue.obj_Provincia._id,
          name: e.itemValue.name,
          is_intermediate: e.itemValue.is_intermediate,
          color: e.itemValue.color,
          indexes: e.itemValue.indexes

        };
        this.regionService.editRegion(body, e.itemValue._id, this.model).subscribe(res => {
          // console.log('TRUE', res);


        });

      }

      this.getData(this.selectVariable._id);

      /* let cantons = this.cantons.filter(canton => !this.selectedCantons.includes(canton));
       cantons.forEach(canton => {
 
         let body = {
           covid: false,
           code: canton.code,
           id_Provincia: canton.obj_Provincia._id,
           name: canton.name,
           active: canton.active
         };
         setTimeout(() => {
           this.regionService.editRegion(body, canton._id, this.model).subscribe(res => { });
         }, 1);
       });
 
       this.getData(this.selectVariable._id);
 
 
 
 
     }*/

    }
  }

  sliderChange(e) {

    let datesString = [];
    this.selectDate = e.value;
    let selectDate = titleCase(new Date(this.selectDate).toLocaleDateString(this.languajeDate, this.optionsDate));
    datesString.push(selectDate);
    this.dateString = datesString;

    this.filterData();

    for (let index = 0; index < this.dateRange.length; index++) {



      if (this.dateRange[index].getTime() === e.value) {

        if (index + 1 === 1) {
          this.minStreamgraph = 0;
          this.maxStreamgraph = this.dateRange.length;
          this.filterDataStreamgraph();

        } else {
          //console.log(this.dateRange[index].getTime(), index + 1);
          this.minStreamgraph = index + 1;
          this.maxStreamgraph = index + 1;
          //console.log(this.dateStreamgraph);
          this.filterDataStreamgraph();

        }
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

  functionToClear() {

    console.log(this.selectedCantons);

    this.selectedCantons.forEach(canton => {

      canton.covid = false;


      let body = {
        covid: false,
        code: canton.code,
        id_Provincia: canton.obj_Provincia._id,
        name: canton.name,
        is_intermediate: canton.is_intermediate,
        color: canton.color,
        indexes: canton.indexes

      };

      this.regionService.editRegion(body, canton._id, this.model).subscribe(res => {
        console.log('false', res);

      });



    });
    this.selectedCantons = [];
    this.getData(this.selectVariable._id);


  }

}







