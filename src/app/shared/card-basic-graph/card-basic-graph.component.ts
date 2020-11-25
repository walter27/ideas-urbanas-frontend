import { Component, OnInit, Input, ViewChild, OnChanges } from "@angular/core";
import { ItemDropdown } from "src/app/core/models/item-dropdown.model";
import { Label, Color, BaseChartDirective } from "ng2-charts";
const years = require("src/app/core/const/years.data");
import * as pluginAnnotations from "chartjs-plugin-annotation";
import { DataService } from "src/app/core/services/data.service";
import { Data } from "@angular/router";
import { Filters } from "src/app/core/models/filters.model";
import { Variable } from "src/app/core/models/variable.model";
import { RegionService } from "src/app/core/services/region.service";
import { Region } from "src/app/core/models/regions.model";
import * as jsPDF from "jspdf";
import { saveAs } from "file-saver";
import { ChartsService } from "src/app/core/services/charts.service";
import { Options } from "ng5-slider";
import { UtilsService } from "src/app/core/services/utils.service";
let { formatLabel, capitalizeFirst } = require("../../core/utils/utils");

enum CharType {
  lineal = "line",
  bar = "bar",
  stacked = "bar",
  pie = "pie",
}

@Component({
  selector: "app-card-basic-graph",
  templateUrl: "./card-basic-graph.component.html",
  styleUrls: ["./card-basic-graph.component.scss"],
})
export class CardBasicGraphComponent implements OnInit, OnChanges {
  subscription: any;

  loading = false;

  value = 0;
  highValue = 0;
  options: Options = {
    ceil: 0,
    floor: 0,
  };

  filters: Filters = {
    page: 0,
    limit: 100,
    ascending: true,
    sort: "name",
  };

  imageBase64: any;

  @Input() title: string;
  @Input("variableSelected") variableSelected: Variable;
  @Input() citySelected: Region;
  @Input() showDropCities = false;
  @Input() showDropYears = false;

  years: ItemDropdown[] = [];


  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  resultData2: Data = [];
  yearsSelected: any[];
  series: any[] = [];
  yearsChart: any[];
  optionsDate = { year: 'numeric', month: '2-digit', day: 'numeric' };
  languajeDate = 'es-ES';
  yearSelected: string;


  cities: ItemDropdown[] = [];

  constructor(
    private dataService: DataService,
    private regionService: RegionService,
    private chartService: ChartsService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if (changes["variableSelected"]) {
      this.series = [];
      if (this.variableSelected.code === '0203' || this.variableSelected.code === '0207') {
        this.getYearsMonth();

      } else {
        this.getYears2();
      }
    }
  }

  getYears() {
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



  getYearsMonth() {


    let id_Cities = [];
    this.yearsSelected = [];

    id_Cities.push(this.citySelected._id);

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



  getYears2() {

    let id_Cities = [];
    this.yearsSelected = [];

    id_Cities.push(this.citySelected._id);

    this.dataService.listDatasPublic(
      { page: 0, limit: 2000, ascending: true, sort: "obj_Canton.name" },
      this.variableSelected._id, id_Cities).subscribe(result => {

        this.resultData2 = result.data;

        let firstYear = this.resultData2[0].year;
        let lastYear = this.resultData2[this.resultData2.length - 1].year;

        if (this.variableSelected.chart_type === 'stacked bar chart') {
          this.yearsSelected.push(lastYear);
        } else {
          for (let i = firstYear; i <= lastYear; i++) {
            this.yearsSelected.push(i);
          }
        }

        this.getYears();
        this.getdata();

      })


  }

  getdata() {

    let id_Cities = [];

    id_Cities.push(this.citySelected._id);

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


  filterData() {

    this.series = [];
    this.yearsChart = [];


    let firstYear = this.resultData2[0].year;
    let lastYear = this.resultData2[this.resultData2.length - 1].year;


    let dataCity = this.resultData2.filter(data => data.obj_Canton.code === this.citySelected.code)
      .sort((a, b) => a.value - b.value)
    let valuesChart = [];

    for (let k = firstYear; k <= lastYear; k++) {

      this.yearsChart.push(`${k}`);


      let values = [];

      let dataYear = dataCity.filter(data2 => data2.year === k);
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
      name: this.citySelected.name,
      data: valuesChart,
      category: this.variableSelected
    });
    //console.log('SERIES', this.series);


   



  }


  filterDataMonth() {

    this.yearsChart = [];
    this.series = [];


    if (this.resultData2.length > 0) {

      let dataCity = this.resultData2.filter(data => data.obj_Canton.code === this.citySelected.code)
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
          let dateFinal = new Date(year, month, day).toLocaleDateString(this.languajeDate, this.optionsDate);
          this.yearsChart.push(dateFinal);

          values.push(dataCity[j].value)


        }

        this.series.push({
          name: this.citySelected.name,
          data: values,
          category: this.variableSelected
        });
      } else {

        console.log();


      }



      //console.log(dataCity);

    }



  }






  getCities() {
    if (this.citySelected) {
      this.cities.push({
        id: this.citySelected._id,
        name: this.citySelected.name,
        check: true,
        color: this.citySelected.color,
      });
    } else {
      this.regionService
        .listRegionsPublic(this.filters, "Canton")
        .subscribe((cities) => {
          cities.data.forEach((c) => {
            this.cities.push({
              id: c._id,
              name: c.name,
              check: true,
              color: c.color,
            });
          });
        });
    }
  }





  onCheckItemYear(e) {
    const idx = this.years.findIndex((c) => c.id === e);
    this.years[idx].check = !this.years[idx].check;

    this.yearsSelected = [];
    this.yearSelected = e;
    this.yearsSelected.push(e);
    this.getdata();
  }

  getTitle() {
    if (this.title) {
      return this.title;
    } else {
      return this.variableSelected.name;
    }
  }

  sliderChange(e) {

    this.yearsSelected = [];
    this.series = [];
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


}
