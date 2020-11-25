import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy, HostListener, } from "@angular/core";
import { Observable } from "rxjs";
import { ResultList } from "src/app/core/models/resultList.model";
import { Clasification } from "src/app/core/models/clasification.model";
import { ClasificationService } from "src/app/core/services/clasification.service";
import { Filters } from "src/app/core/models/filters.model";
import { map } from "rxjs/operators";
import { VariableService } from "src/app/core/services/variable.service";
import { Variable } from "src/app/core/models/variable.model";
import { DataService } from "src/app/core/services/data.service";
import { Data, ActivatedRoute, Router } from "@angular/router";
import * as Chart from "chart.js";
import { RegionService } from "src/app/core/services/region.service";
import { ItemDropdown } from "src/app/core/models/item-dropdown.model";
import { Label, Color, BaseChartDirective } from "ng2-charts";
const years = require("src/app/core/const/years.data");
import * as pluginAnnotations from "chartjs-plugin-annotation";
import { ChartsService } from "src/app/core/services/charts.service";
import * as jsPDF from "jspdf";
import { Options } from "ng5-slider";
import { UtilsService } from "src/app/core/services/utils.service";
import { NgxSpinnerService } from "ngx-spinner";
let { formatLabel, capitalizeFirst } = require("../../core/utils/utils");
let { titleCase }: any = require('../../core/utils/utils');


@Component({
  selector: "app-ides-thematic",
  templateUrl: "./ides-thematic.component.html",
  styleUrls: ["./ides-thematic.component.scss"],
})
export class IdesThematicComponent implements OnInit, OnDestroy {
  subscription: any;

  loading = false;

  spinner1 = "spinner";
  value = 20;
  highValue = 40;
  options: Options = {
    ceil: 100,
    floor: 0,
  };

  clasificationSelected: Clasification;
  variableSelected: Variable;

  filters: Filters = {
    page: 0,
    limit: 100,
    ascending: true,
    sort: "name",
  };

  resultClasification$: any;
  resultVariables$: Observable<ResultList<Variable>>;
  resultData: Data;
  resultData2: Data;


  ctx: any;
  myChart: Chart;
  years: ItemDropdown[] = [];
  cities: any[] = [];
  citiesSelected: any[] = [];
  yearSelected = "";
  imageBase64: any;


  loadCity = false;

  //new
  starPoint: number;
  category: any[];
  series: any[] = [];
  yearsChart: any[];
  yearsSelected: any[];




  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(
    private clasificationService: ClasificationService,
    private variableService: VariableService,
    private dataService: DataService,
    private regionService: RegionService,

  ) { }

  ngOnInit() {
    sessionStorage.clear();

    this.loadCity = true;
    this.getCities();


  }


  getCities() {

    this.regionService
      .listRegionsPublic(
        { page: 0, limit: 1000, ascending: true, sort: "name" },
        "Canton"
      )
      .subscribe((resp) => {
        this.cities = [];
        const setCities = new Set();
        resp.data.forEach((c) => {
          if (!setCities.has(c._id) && c.is_intermediate) {
            this.cities.push({
              id: c._id,
              name: titleCase(c.name),
              check: true,
              color: c.color,
              code: c.code
            });
            setCities.add(c._id);
          }
        });
        this.getClasifications();
      });
  }
  getClasifications() {

    //let finalRes: any = [];
    this.resultClasification$ = this.clasificationService
      .listClasificationPublic(this.filters)
      .pipe(
        map((resp) => {
          this.clasificationSelected = resp.data[0];
          this.getVariables();
          /*for (const thematic of resp.data) {
            thematic.image_active_route = `assets/ICONOS/${thematic.name}.png`;
            thematic.image_route = `assets/ICONOS/${thematic.name}.png`;
            finalRes.push(thematic);
          }*/
          return resp.data;
        })
      );



  }
  getVariables() {
    this.resultVariables$ = this.variableService
      .getVariablesByClasification(this.clasificationSelected._id)
      .pipe(
        map((resp) => {
          this.variableSelected = resp.data[0];
          sessionStorage.setItem(
            "variableSelectedName",
            this.variableSelected.name
          );
          sessionStorage.setItem(
            "variableSelectedLabel",
            `${this.variableSelected.label} (${this.variableSelected.measure_symbol})`
          );
          sessionStorage.setItem(
            "variableSelectedMeasureSymbol",
            this.variableSelected.measure_symbol
          );

          if (this.citiesSelected.length === 0) {
            this.citiesSelected.push(this.cities[0])

          }


          this.getYears()
          return resp;
        })
      );
  }


  getYearsMonth() {


    let id_Cities = [];
    this.yearsSelected = [];

    for (let i = 0; i < this.citiesSelected.length; i++) {
      id_Cities.push(this.citiesSelected[i].id);
    }

    this.dataService.listDatasPublic({ page: 0, limit: 2000, ascending: true, sort: "obj_Canton.name" },
      this.variableSelected._id, id_Cities).subscribe(result => {

        this.resultData2 = result.data;


        if (this.resultData2.length > 0) {
          let lastYear = this.resultData2[this.resultData2.length - 1].year;


          this.yearsSelected.push(`${lastYear}`)
          this.getdata();

        } else {
          this.series = [];
        }




      })

  }


  getYears() {

    let id_Cities = [];
    this.yearsSelected = [];

    for (let i = 0; i < this.citiesSelected.length; i++) {
      id_Cities.push(this.citiesSelected[i].id);
    }


    this.dataService.listDatasPublic(
      { page: 0, limit: 2000, ascending: true, sort: "obj_Canton.name" },
      this.variableSelected._id, id_Cities).subscribe(result => {

        this.resultData2 = result.data;

        let firstYear = this.resultData2[0].year;
        let lastYear = this.resultData2[this.resultData2.length - 1].year;

        if (this.variableSelected.chart_type === 'stacked bar chart') {

          this.yearsSelected.push(lastYear)
        } else {
          for (let i = firstYear; i <= lastYear; i++) {
            this.yearsSelected.push(i);
          }
        }


        this.getYearsAndCities();


        this.getdata();

      })


  }

  getYearsAndCities() {
    this.years = [];
    this.yearSelected = '';

    const setYears = new Set();

    this.resultData2.forEach((resp) => {
      setYears.add(resp.year);
    });

    const yearsSorted = Array.from(setYears.values()).sort();

    const newOptions: Options = Object.assign({}, this.options);
    newOptions.floor = +yearsSorted[0];
    newOptions.ceil = +yearsSorted[yearsSorted.length - 1];
    this.options = newOptions;
    this.highValue = +yearsSorted[0];
    this.value = +yearsSorted[yearsSorted.length - 1];

    for (let i = this.highValue; i <= this.value; i++) {
      this.yearSelected = i.toString();

      this.years.push({ id: i.toString(), name: i.toString(), check: true });
    }
  }

  getSelectCities() {
    //console.log(this.citiesSelected);

    if (this.variableSelected.code === '0203' || this.variableSelected.code === '0207') {
      this.getYearsMonth();

    } else {
      this.getdata();
    }
  }

  getVariableSelected() {
    //console.log(this.variableSelected);
    this.onSelectVariable(this.variableSelected);

    if (this.variableSelected.code === '0203' || this.variableSelected.code === '0207') {
      this.getYearsMonth();

    } else {
      this.getYears();
    }
  }

  getdata() {

    let id_Cities = [];


    for (let i = 0; i < this.citiesSelected.length; i++) {
      id_Cities.push(this.citiesSelected[i].id);
    }

    this.dataService.listDatasPublic(
      { page: 0, limit: 2000, ascending: true, sort: "obj_Canton.name" },
      this.variableSelected._id, id_Cities, this.yearsSelected
    ).subscribe(result => {


      this.resultData2 = result.data;


      if (this.variableSelected.code === '0203' || this.variableSelected.code === '0207') {
        this.filterDataMonth();
      } else {
        this.filterData();

      }


      /*if (this.variableSelected.chart_type === 'stacked bar chart') {
        this.filterDataStacked();

      } else {
        this.filterData();
      }*/


      //console.log(this.resultData2);


    })

    //console.log(this.citiesSelected);
    //console.log(this.variableSelected);





  }


  filterDataMonth() {

    this.yearsChart = [];
    this.series = [];


    if (this.resultData2.length > 0) {
      for (let i = 0; i < this.citiesSelected.length; i++) {

        let dataCity = this.resultData2.filter(data => data.obj_Canton.code === this.citiesSelected[i].code)
          .sort((a, b) => {

            let date = new Date(a.date);
            let day = date.getUTCDate();
            let year = date.getUTCFullYear();
            let month = date.getUTCMonth();
            let dateFinal = new Date(year, month, day);

            let date2 = new Date(b.date);
            let day2 = date2.getUTCDate();
            let year2 = date2.getUTCFullYear();
            let month2 = date2.getUTCMonth();
            let dateFinal2 = new Date(year2, month2, day2);



            return dateFinal.getTime() - dateFinal2.getTime();
          })

        if (dataCity.length > 0) {



          let values = [];
          for (let j = 0; j < dataCity.length; j++) {
            let date = new Date(dataCity[j].date);
            let day = date.getUTCDate();
            let year = date.getUTCFullYear();
            let month = date.getUTCMonth();
            let dateFinal = new Date(year, month, day); //.toLocaleDateString(this.languajeDate, this.optionsDate);
            this.yearsChart.push(dateFinal);

            values.push(dataCity[j].value)


          }

          this.series.push({
            name: this.citiesSelected[i].name,
            data: values,
            category: this.variableSelected
          });
        } else {

          console.log();


        }



        //console.log(dataCity);

      }
    }



  }


  filterData() {

    this.category = [];
    this.series = [];
    this.starPoint = this.highValue;
    this.yearsChart = [];


    let firstYear = this.resultData2[0].year;
    let lastYear = this.resultData2[this.resultData2.length - 1].year;

    for (let k = firstYear; k <= lastYear; k++) {

      this.yearsChart.push(`${k}`);

    }

    for (let i = 0; i < this.citiesSelected.length; i++) {

      let dataCity = this.resultData2.filter(data => data.obj_Canton.code === this.citiesSelected[i].code)
        .sort((a, b) => a.value - b.value)
      let valuesChart = [];


      for (let k = firstYear; k <= lastYear; k++) {

        let values = [];

        let dataYear = dataCity.filter(data => data.year === k);
        for (let h = 0; h < dataYear.length; h++) {

          let date = new Date(dataYear[h].date);
          let day = date.getUTCDate();
          let year = date.getUTCFullYear();
          let month = date.getUTCMonth();
          let dateFinal = new Date(year, month, day);

          values.push({

            value: dataYear[h].value,
            date: dateFinal

          })

        }

        let data = values.sort((a, b) => b.date - a.date);
        if (data[0]) {


          valuesChart.push(data[0].value)
        } else {

          valuesChart.push(0)


        }






      }



      this.series.push({
        name: this.citiesSelected[i].name,
        data: valuesChart,
        category: this.variableSelected
      });






    }




    //console.log(this.highValue);
    //console.log(this.options);



  }





  onSelectClasification(clasification) {
    this.clasificationSelected = clasification;
    sessionStorage.removeItem("citiesHidden");
    this.getVariables();
  }

  onSelectVariable(variable) {
    this.variableSelected = variable;
    sessionStorage.setItem("variableSelectedName", this.variableSelected.name);
    sessionStorage.setItem(
      "variableSelectedLabel",
      `${this.variableSelected.label} (${this.variableSelected.measure_symbol})`
    );
    sessionStorage.setItem(
      "variableSelectedMeasureSymbol",
      this.variableSelected.measure_symbol
    );
    sessionStorage.removeItem("citiesHidden");
  }






  sliderChange(e) {


    this.yearsSelected = [];

    for (let i = e.value; i <= e.highValue; i++) {
      this.yearsSelected.push(i);
    }



    this.getdata();

    for (let i = this.options.floor; i <= this.options.ceil; i++) {
      if (i < e.value || i > e.highValue) {
        const idx = this.years.findIndex((c) => +c.id === i);
        this.years[idx].check = false;
      } else {
        const idx = this.years.findIndex((c) => +c.id === i);
        this.years[idx].check = true;
      }
    }
  }


  onCheckYear(e) {

    this.yearsSelected = [];
    this.yearSelected = e;
    this.yearsSelected.push(e);
    this.getdata();

  }

  ngOnDestroy() {
    sessionStorage.clear();
  }


}
