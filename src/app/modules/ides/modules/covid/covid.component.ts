import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClasificationService } from '../../../../core/services/clasification.service';
import { VariableService } from '../../../../core/services/variable.service';
import { DataService } from '../../../../core/services/data.service';
import { RegionService } from '../../../../core/services/region.service';
import { Region } from 'src/app/core/models/regions.model';
import { Variable } from 'src/app/core/models/variable.model';
import { Options, LabelType } from 'ng5-slider';
import { Observable } from 'rxjs';
import { Data } from '@angular/router';
import { ResultList } from 'src/app/core/models/resultList.model';
import { ItemDropdown } from 'src/app/core/models/item-dropdown.model';


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
    sort: 'name'
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



  constructor(private resultClasification: ClasificationService,
    private variableService: VariableService,
    private dataService: DataService,
    private regionService: RegionService) {

    this.minScroll = 0;
    this.maxScroll = 6;
    this.getCantons();
    this.getClasification();

  }


  ngOnInit() {
   /* let elem: HTMLElement = document.getElementById('navbarMenu');
    elem.style.setProperty("background-color", '#189cff');
    elem.classList.add("sticky-top");
    elem.classList.remove("fixed-top");*/

  }


  ngOnDestroy() {

    let dataTop = [...this.dataHigcharts].sort((a, b) => b.data[0] - a.data[0]).slice(0, 5);
    let cantonsTop = [];

    for (const canton of this.selectedCantons) {

      for (const cantontop of dataTop) {

        if (canton.name === cantontop.name) {

          cantonsTop.push(canton);

        }
      }

    }

    let cantonsNotop = this.cantons.filter(canton => !cantonsTop.includes(canton));


    cantonsTop.forEach(cantonTop => {
      let body = {
        covid: true,
        code: cantonTop.code,
        id_Provincia: cantonTop.obj_Provincia._id,
        name: cantonTop.name,
        active: cantonTop.active
      };

      setTimeout(() => {
        this.regionService.editRegion(body, cantonTop._id, this.model).subscribe(res => { });
      }, 1);

    });


    cantonsNotop.forEach(cantonNoTop => {
      let body = {
        covid: false,
        code: cantonNoTop.code,
        id_Provincia: cantonNoTop.obj_Provincia._id,
        name: cantonNoTop.name,
        active: cantonNoTop.active
      };

      setTimeout(() => {
        this.regionService.editRegion(body, cantonNoTop._id, this.model).subscribe(res => { });
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
      this.cantons = data.data;
      //console.log(this.cantons);

      /* let dataCovid: any;
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
        description: 'Casos de defunciones por covid-19',
        value: '',
        year: '2020',
        id_Canton: '',
        id_Variable: '5f0cf58fedd2b60af04846da',
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

    //console.log(this.dataFinal);


    //this.dataPrueba.push(this.dataFinal[0]);
    //this.dataPrueba.push(this.dataFinal[1]);
    //this.dataPrueba.push(this.dataFinal[8]);

    //console.log(this.dataPrueba);
    /* this.dataService.addData(this.dataPrueba[0]).subscribe((data2) => {
       console.log(data2);
     });*/


    /*for (let index = 0; index < this.dataFinal.length; index++) {

      if (index > 34254 && index <= 38060) {
        //console.log(this.dataFinal[index], index);

        setTimeout(() => {
          this.dataService.addData(this.dataFinal[index]).subscribe((data2) => {
            console.log(data2, index);
          });
        }, 3000);

      }


    }*/

    //console.log("terminado..");

  }


  getVariables(idClasification: string) {

    this.variableService.getVariablesByClasification(idClasification).subscribe((data) => {


      this.varibales2 = data.data;
      this.selectVariable = this.varibales2[0];
      this.getData(this.selectVariable._id);
      console.log(this.selectVariable._id);

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
    setTimeout(() => {
      this.filterData();
      this.filterDataStreamgraph();
    }, 2000);

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
        return new Date(value).toDateString();
      }
    };




  }


  filterData() {

    let datesString = [];
    if (!this.selectDate || this.selectDate === 0) {
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
            date: new Date(dateStr).toLocaleString()


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

  async loadData(dataHigcharts: any, dataHighmap: any) {



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

      this.dataHigcharts = await dataHighchartsFinal.sort((a, b) => { return b.data[0] - a.data[0] });
      this.dataMapa = await dataHighmapFinal;
    }



  }


  filterDataStreamgraph() {

    let datesStringFinal = [];
    let dataStreamGraph = [];
    let dataStreamGraphCopy = [];
    datesStringFinal.push('');

    for (const dateString of this.dateRange) {

      let dateStringFinal = dateString.getTime();
      let selectDate = new Date(dateStringFinal).toDateString();
      datesStringFinal.push(selectDate);
    }
    this.dateStringAll = datesStringFinal;
    if (this.selectDate === this.dateRange[0].getTime()) {
      this.minStreamgraph = 0;
      this.maxStreamgraph = this.dateRange.length;
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

  async loadDataStreamGraph(dataStreamGraphCopy: any) {

    if (this.selectedCantons) {

      let dataStreamGraphCanton = [];

      for (const selectCanton of this.selectedCantons) {


        for (const dataStreamgraphCanton of dataStreamGraphCopy) {
          if (selectCanton.name === dataStreamgraphCanton.name) {

            dataStreamGraphCanton.push(dataStreamgraphCanton);

          }

        }
      }
      this.dataStreamGraphFinal = await dataStreamGraphCanton;
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

  getSelects() {

    if (this.selectedCantons) {

      this.selectedCantons.forEach(cantonSelected => {

        let body = {
          covid: true,
          code: cantonSelected.code,
          id_Provincia: cantonSelected.obj_Provincia._id,
          name: cantonSelected.name,
          active: cantonSelected.active
        };
        setTimeout(() => {
          this.regionService.editRegion(body, cantonSelected._id, this.model).subscribe(res => { });
        }, 1);


      });

      let cantons = this.cantons.filter(canton => !this.selectedCantons.includes(canton));
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




    }

  }

  sliderChange(e) {

    let datesString = [];
    this.selectDate = e.value;
    let selectDate = new Date(this.selectDate).toDateString();
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

}







