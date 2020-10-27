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

export class CovidComponent implements OnInit {

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
  dateString: any[] = [];
  dateStringAll: any[] = [];
  dataMapa: any[] = [];


  minStreamgraph: number;
  maxStreamgraph: number;
  maxExport: number;

  rangeValues: any = [];

  dataHigcharts: any[] = [];
  dataStreamGraphFinal: any[] = [];

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


  load= false;




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

  getCantons() {



    this.regionService.listRegions(this.filters, this.model).subscribe((data) => {


      this.cantons = data.data;

      for (let i = 0; i < this.cantons.length; i++) {

        if (this.cantons[i].name === 'Guayaquil' || this.cantons[i].name === 'Babahoyo' ||
          this.cantons[i].name === 'Quito' || this.cantons[i].name === 'Lago Agrio') {

          this.selectedCantons.push(this.cantons[i]);

        }
      }




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

  getVariables(idClasification: string) {


    this.keysVariable = [];


    this.variableService.getVariablesByClasification(idClasification).subscribe((data) => {


      data.data.forEach(variable => {

        this.keysVariable.push(variable.name);

      });




      this.varibales2 = data.data;
      this.selectVariable = this.varibales2[0];
      this.traslate();

    });

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
        this.getDate();

      }

      if (lang === 'en') {
        this.languajeDate = 'en-US';
        this.getDate();

      }

    })





  }

  getData() {

    let idCantons = [];
    for (let i = 0; i < this.selectedCantons.length; i++) {
      idCantons.push(this.selectedCantons[i]._id);
    }
    this.result$ = this.dataService.listDatasCovid(this.filters, this.selectVariable._id, idCantons);
    this.filterData();
    this.filterDataStreamgraph();

  }


  getDate() {

    let dateRanges = [];
    let idCantons = [];
    for (let i = 0; i < this.selectedCantons.length; i++) {
      idCantons.push(this.selectedCantons[i]._id);
    }

    this.dataService.listDatasCovid(this.filters, this.selectVariable._id, idCantons).subscribe(data => {


      for (const info of data.data) {
        dateRanges.push(info.date);

      }
      this.rangeValues = dateRanges;
      this.createDateRange();

    });

    this.result$ = this.dataService.listDatasCovid(this.filters, this.selectVariable._id, idCantons);

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


    //console.log(this.dateRange);


    this.dateString = [];
    this.dateStringAll = [];

    if (!this.selectDate || this.selectDate === 0) {
      this.selectDate = this.dateRange[0].getTime();
      this.dateString.push(this.selectDate) /*toLocaleDateString(this.languajeDate, this.optionsDate)))*/
    }
    this.dateString.push(this.selectDate) /*toLocaleDateString(this.languajeDate, this.optionsDate)))*/



    //let datesStringFinal = [];
    // datesStringFinal.push('');

    for (const dateString of this.dateRange) {

      //let dateStringFinal = dateString.getTime();
      //let selectDate = titleCase(new Date(dateString.getTime()).toLocaleDateString(this.languajeDate, this.optionsDate));
      //datesStringFinal.push(titleCase(new Date(dateString.getTime()).toLocaleDateString(this.languajeDate, this.optionsDate)));
      this.dateStringAll.push(dateString);/*.toLocaleDateString(this.languajeDate, this.optionsDate)));*/

    }
    //this.dateStringAll = datesStringFinal;

    let dataBarChart = [];
    let dataMapChart = [];

    this.result$.forEach(element => {
      //console.log('DATAOBSERVABLE', dataCovidlocal);


      for (const dataCovid of element.data) {

        //console.log(dataCovid);


        let date: Date = new Date(dataCovid.date);
        let day = date.getUTCDate();
        let year = date.getUTCFullYear();
        let month = date.getUTCMonth();
        let dateStr = new Date(year, month, day).getTime();


        //  console.log(dataCovid);

        if (this.selectDate === dateStr) {

          // console.log(dateStr);



          let dataBar = {
            data: [Number(dataCovid.value)],
            name: dataCovid.obj_Canton.name,
            //date: titleCase(new Date(dateStr).toLocaleDateString(this.languajeDate, this.optionsDate))


          };


          let dataMap: [string, number] = [
            dataCovid.obj_Canton.code,
            Number(dataCovid.value)
          ];


          dataBarChart.push(dataBar);
          dataMapChart.push(dataMap);




        }


      }






      this.dataHigcharts = dataBarChart.sort((a, b) => b.data[0] - a.data[0]);
      this.dataMapa = dataMapChart;


      //this.loadData(dataHigcharts, dataHighmap);
    });







  }




  filterDataStreamgraph() {

    let dataStreamGraph = [];
    let dates = [];

    for (let i = 0; i < this.dateStringAll.length; i++) {

      let date = new Date(this.dateStringAll[i]).toLocaleDateString(this.languajeDate, this.optionsDate);

      dates.push(date);

    }

    this.result$.forEach(data => {


      for (let j = 0; j < this.selectedCantons.length; j++) {

        let dataCanton = data.data.filter(data => data.obj_Canton.code === this.selectedCantons[j].code);

        let values = [];


        for (let i = 0; i < dataCanton.length; i++) {



          let date: Date = new Date(dataCanton[i].date);
          let day = date.getUTCDate();
          let year = date.getUTCFullYear();
          let month = date.getUTCMonth();
          let dateTime = new Date(year, month, day).toLocaleDateString(this.languajeDate, this.optionsDate);

          //console.log(dateTime);


          if (dates.includes(dateTime)) {

            values.push(dataCanton[i].value)



          } else {
            console.log(dates);

            values.push(0);
          }

        }



        dataStreamGraph.push({
          name: this.selectedCantons[j].name,
          data: values
        })
        //console.log(dataCanton.length);
        // console.log(this.dateRange);
      }



      this.dataStreamGraphFinal = dataStreamGraph;





    });


    this.load = true;


  }






  getSelectVariable() {

    //this.dataHigcharts = [];
    //this.dataMapa = [];
    //this.dataStreamGraphFinal = [];
    this.selectDate = 0;
    this.options = {
      ceil: 0,
      floor: 0
    };
    this.getDate();
  }

  getSelects(e) {

    //this.dataHigcharts = [];
    //this.dataMapa = [];
    //this.dataStreamGraphFinal = [];
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


      /*if (!this.selectedCantons.includes(e.itemValue)) {


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

      }*/

      this.getData();

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

    // let datesString = [];
    this.selectDate = e.value;
    //let selectDate = titleCase(new Date(this.selectDate).toLocaleDateString(this.languajeDate, this.optionsDate));
    //datesString.push(selectDate);
    //this.dateString = datesString;

    this.filterData();

    /*for (let index = 0; index < this.dateRange.length; index++) {



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


    }*/
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
    this.getDate();


  }

  printData(data) {

    console.log(data);

  }

}







