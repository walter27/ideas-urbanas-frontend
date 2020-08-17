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


@Component({
  selector: "app-ides-index",
  templateUrl: "./ides-index.component.html",
  styleUrls: ["./ides-index.component.scss"],
})
export class IdesIndexComponent implements OnInit, OnDestroy, OnChanges {
  filters: Filters = {
    page: 0,
    limit: 100,
    ascending: true,
    sort: "_id",
  };

  value = 2010;
  highValue = 2020;
  options: Options = {
    ceil: 2020,
    floor: 2010,
  };

  highcharts: any;
  updateDemo: boolean;
  chartOptions: any = {};
  clasifications: any = [];
  series: any = [];


  @Input() marginAuto = false;
  @Input() title: string;
  @Input() variableSelected: Variable;
  @Input() citySelected: Region;
  @Input() showDropCities = false;
  @Input() showDropYears = false;
  @Input('activeCities') activeCities: any;
  @Input('yearsSelected') yearsSelected: any;
  @Input() zone: string;

  years: ItemDropdown[] = [];

  public lineChartData: Chart.ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartColors: Color[] = [];
  public lineChartLegend = true;
  public lineChartType = "line";
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  resultData: Data;

  cities: ItemDropdown[] = [];
  axes: ItemDropdown[] = [];
  baseData: any;
  //filterData: any;
  loadData = false;

  // Radar
  public radarChartOptions: RadialChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scale: {
      ticks: {
        stepSize: 20,
        min: 0,
        max: 100,
      },
      pointLabels: {
        fontSize: window.innerWidth < 575 ? 10 : 12,
        fontColor: "black",
        fontFamily: "Noto Sans TC",
        lineHeight: 1,
      },
      gridLines: {
        lineWidth: 2,
        zeroLineColor: "#e4e9f2",
        color: ["#e2e9f0", "#e3edf7", "#f4f8fd", "#fdf9e5", "#fcf4e2"],
      },
    },
    legend: {
      onClick(event, legendItem) {
        const index = legendItem.datasetIndex;
        const ci = this.chart;
        const meta = ci.getDatasetMeta(index);

        let t = [];
        if (sessionStorage.getItem("citiesHidden")) {
          t = JSON.parse(sessionStorage.getItem("citiesHidden"));
          if (
            ci.data.datasets.length - 1 ===
            JSON.parse(sessionStorage.getItem("citiesHidden")).length &&
            t.indexOf(legendItem.text) === -1
          ) {
            return;
          }
        }

        // See controller.isDatasetVisible comment
        meta.hidden =
          meta.hidden === null ? !ci.data.datasets[index].hidden : null;

        if (meta.hidden) {
          t.push(legendItem.text);
        } else {
          const idx = t.indexOf(legendItem.text);
          t.splice(idx, 1);
        }
        sessionStorage.setItem("citiesHidden", JSON.stringify(t));

        // We hid a dataset ... rerender the chart
        ci.update();
      },
      labels: {
        fontFamily: '"Noto Sans TC", serif',
        fontSize: 10,
        fontColor: "black",
      },
    },
    tooltips: {
      bodyFontSize: 16,
      titleFontSize: 16,
      bodyFontFamily: '"Noto Sans TC", serif',
      titleFontFamily: '"Noto Sans TC", serif',
      enabled: false,
      custom(tooltip) {
        // Tooltip Element
        const t = document.getElementById("chartjs-tooltip");
        if (t) {
          t.remove();
        }
        let tooltipEl = document.getElementById("chartjs-tooltip");

        if (!tooltipEl) {
          tooltipEl = document.createElement("div");
          tooltipEl.id = "chartjs-tooltip";
          tooltipEl.innerHTML = "<table></table>";
          this._chart.canvas.parentNode.appendChild(tooltipEl);
        }

        // Hide if no tooltip
        if (tooltip.opacity === 0) {
          tooltipEl.style.opacity = "0";
          return;
        }

        // Set caret Position
        tooltipEl.classList.remove("above", "below", "no-transform");
        if (tooltip.yAlign) {
          tooltipEl.classList.add(tooltip.yAlign);
        } else {
          tooltipEl.classList.add("no-transform");
        }

        function getBody(bodyItem) {
          return bodyItem.lines;
        }

        // Set Text
        if (tooltip.body) {
          // tslint:disable-next-line:no-string-literal
          const description = tooltip["afterBody"];
          // tslint:disable-next-line:no-string-literal
          const title = tooltip["title"];
          const titleLines = [title];
          const bodyLines = tooltip.body.map(getBody);

          let innerHtml = '<thead style="color: rgba(7, 109, 205, 1)">';

          titleLines.forEach(function (title) {
            innerHtml += "<tr><th>" + title + "</th></tr>";
          });
          innerHtml += "</thead><tbody>";

          bodyLines.forEach(function (body, i) {
            const color = sessionStorage.getItem(
              body[0].split(":")[0].toLocaleLowerCase()
            );
            const colors = { backgroundColor: color, borderColor: "white" };
            let style = "background:" + colors.backgroundColor;
            style += "; border-color:" + colors.borderColor;
            style += "; border-width: 2px";
            const span =
              '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
            const span1 = '<span class="chartjs-tooltip-key1"></span>';
            innerHtml +=
              "<tr><td>" + span + body[0].split(":")[0] + "</td></tr>";
            innerHtml +=
              '<tr><td style="color: #8F8F8F; font: Regular 16px/30px Noto Sans TC;">' +
              span1 +
              body[0].split(":")[1] +
              "</td></tr>";
          });
          if (description.length > 0) {
            innerHtml += "<tr><td>" + description + "</td></tr>";
          }
          innerHtml += "</tbody>";

          const tableRoot = tooltipEl.querySelector("table");
          tableRoot.innerHTML = innerHtml;
        }

        const positionY = this._chart.canvas.offsetTop;
        const positionX = this._chart.canvas.offsetLeft;

        // Display, position, and set styles for font
        tooltipEl.style.opacity = "1";
        tooltipEl.style.left = positionX + tooltip.caretX + "px";
        tooltipEl.style.top = positionY + tooltip.caretY + "px";
        tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
        tooltipEl.style.fontSize = tooltip.bodyFontSize + "px";
        tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
        tooltipEl.style.padding =
          tooltip.yPadding + "px " + tooltip.xPadding + "px";
      },
      callbacks: {
        title(item, data) {
          return data.labels[item[0].index].toString();
        },
        label(tooltipItem, data) {
          const datasetLabel =
            data.datasets[tooltipItem.datasetIndex].label || "";
          let value = tooltipItem.yLabel.toString();
          // tslint:disable-next-line:radix
          if (parseInt(value) >= 1000) {
            value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          }
          return datasetLabel + ": " + value;
        },
      },
    },
  };
  public radarChartLabels: Label[] = [];

  public radarChartData: ChartDataSets[] = [];
  public radarChartType: ChartType = "radar";

  cantons: any[] = [];
  cantonsSlected: any[] = [];
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
    private router: Router
  ) {

    this.updateDemo = false;
    this.highcharts = Highcharts;
    HC_exporting(this.highcharts);
    HC_export(this.highcharts);
    HC_accessibility(this.highcharts);
    MO_Highcharts(this.highcharts);
  }

  ngOnInit() {
    this.loadData = true;
    if (this.citySelected) {
      this.getData();
    }
  }

  ngOnChanges(changes) {
    if (changes['activeCities'] || changes["yearsSelected"] && this.activeCities.length > 0 && this.yearsSelected.length > 0) {
      this.getData();
    }
  }

  /* @HostListener('window:scroll', ['$event'])
  onWindowIndexScroll($event) {
    if (!this.loadData && this.router.url === '/home' && $event.srcElement.scrollingElement.scrollTop > 100) {
      this.loadData = true;
      this.getData();
    }
  }*/

  updateChart(resp) {
    this.radarChartData = [];
    this.radarChartLabels = [];
    Object.keys(resp).forEach((c) => {
      Object.keys(resp[c]).forEach((cl) => {
        if (this.radarChartLabels.indexOf(cl) === -1) {
          this.radarChartLabels.push(cl);
        }
      });
      this.radarChartLabels.sort();
      let color = "";
      if (!this.citySelected) {
        let city = this.activeCities.find(
          (x) => x.name.toLowerCase() === c.toLowerCase()
        );
        color = city.color;
      } else {
        color = this.citySelected.color;
      }

      sessionStorage.setItem(c.toLowerCase(), color);

      this.radarChartData.push({
        data: [],
        label: c,
        borderColor: color,
        pointBorderColor: "white",
        pointBackgroundColor: color,
        // backgroundColor: COLORS[idx].colorOpacity,
        fill: false,
      });
    });

    this.axes = [];
    this.radarChartLabels.forEach((labels) => {
      this.axes.push({
        id: labels.toString(),
        name: labels.toString(),
        check: false,
      });
      this.radarChartData.forEach((ci) => {
        ci.data.push(resp[ci.label][labels.toString()]);
      });
    });

    let splitLabels = [];

    if (window.innerWidth <= 768) {
      this.radarChartLabels.forEach((label) => {
        let elementsLabel = label.toString().split(" ");

        if (elementsLabel.length == 2) {
          splitLabels.push(elementsLabel);
        } else if (elementsLabel.length > 2) {
          let elementLabelResult = [];

          if (elementsLabel.length > 2) {
            elementLabelResult.push(elementsLabel[0] + " " + elementsLabel[1]);
          }

          let secondLine = " ";
          for (let i = 2; i < elementsLabel.length; i++) {
            secondLine = secondLine + elementsLabel[i];
          }
          elementLabelResult.push(secondLine.trimRight());
          splitLabels.push(elementLabelResult);
        } else {
          splitLabels.push(elementsLabel[0]);
        }

        this.radarChartLabels = splitLabels;
      });
    }

    this.radarChartData.forEach((ci) => {
      ci.label = capitalizeFirst(ci.label);
    });

    /*setTimeout(() => {
      this.chartService.imageRadarBase24.then((value) => {
        this.imageBase64 = {
          name: 'chart',
          data: value,
          type: 'radar'
        };
      });
    }, 3000);*/
  }

  getData() {
    if (this.citySelected) {
      this.dataService
        .listDataIndexes(this.citySelected._id)
        .subscribe((resp) => {
          this.baseData = resp;
          this.updateChart(resp);
          this.filterData();
          this.marginSocial = 'mr-lg-5';
        });
    } else {
      this.marginSocial = 'mr-lg-1';

      let idCities = [];
      this.activeCities.forEach(city => {
        idCities.push(city.id);
      });
      this.dataService.listDataIndexes(idCities, this.yearsSelected).subscribe((resp) => {
        this.baseData = resp;
        this.updateChart(resp);
        this.filterData();
        //this.cantons = [];
        /*Object.keys(resp).forEach((c) => {
          this.cantons.push({
            name: c,
          });
        });
        this.getCantonsSelected();*/
      });
    }
  }

  /*getCantonsSelected() {
    let selectedCantons = [];

    if (this.cantonsSlected.length === 0) {
      this.cantonsSlected.push(this.cantons[0]);
    }

    this.cantonsSlected.forEach((canton) => {
      selectedCantons.push(canton.name);
    });

    this.filteredDataIndexes(selectedCantons);
  }

  filteredDataIndexes(cantonsSelected) {
    let filtered = Object.keys(this.baseData)
      .filter((key) => cantonsSelected.includes(key))
      .reduce((obj, key) => {
        obj[key] = this.baseData[key];
        return obj;
      }, {});

    this.updateChart(filtered);
  }*/

  onCheckItemYear(e) {
    const idx = this.years.findIndex((c) => c.id === e);
    this.years[idx].check = !this.years[idx].check;
    this.getData();
  }

  onCheckItemAxes(e) {
    // this.filterData = this.baseData;
    // Object.keys(this.filterData).forEach(c => {
    //   let items = [];
    //   Object.keys(this.filterData[c]).forEach(cl => {
    //     if (cl == e)
    //       delete this.filterData[c]
    //   });
    // });
    // this.updateChart(this.filterData);
  }

  getTitle() {
    if (this.title) {
      return this.title;
    } else {
      return this.variableSelected.name;
    }
  }

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    // console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    // console.log(event, active);
  }

  filterData() {

    console.log(this.baseData);
    

    this.clasifications = [];
    this.series = [];
    let firstData = Object.keys(this.baseData)[0];
    let valuesData = this.baseData[firstData];
    Object.keys(valuesData).forEach((c) => {
      this.clasifications.push(c);
    });

    Object.keys(this.baseData).forEach((city) => {
      let data = [];

      let clasificationName = this.baseData[city];

      Object.keys(clasificationName).forEach((clasification) => {

        let value = clasificationName[clasification];

        data.push(value);
      });
      this.series.push({
        name: city,
        data,
        pointPlacement: 'on'
      });
    });

    //console.log(this.series);

    //console.log(this.clasifications);


    this.createRadar();


  }


  createRadar() {

    this.chartOptions = {
      chart: {
        polar: true,
        type: 'line'
      },
      title: {
        text: '',
      },

      pane: {
        size: '80%'
      },

      xAxis: {
        categories: this.clasifications,
        tickmarkPlacement: 'on',
        lineWidth: 0
      },

      yAxis: {
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: 0
      },

      tooltip: {
        shared: true,
        pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
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
      }
    };
    this.updateDemo = true;
    this.getURLImage();

  }

  getURLImage() {
    let chartsDetails = {
      type: "png",
      options: this.chartOptions,
    };
    this.chartService.generateImage(chartsDetails).subscribe((resp) => { });

  }

  sharedImage(item) {

    this.body = {
      name: 'radar',
      type: this.chartOptions.chart.type
    }
    this.chartService.shareImage(this.body).subscribe((resp) => {
      this.socialMedia[0].link = `https://www.facebook.com/sharer.php?u=${resp}`;
      this.socialMedia[1].link = `https://twitter.com/intent/tweet?url=${resp}&text=Plataforma de Ideas Urbanas`;
    });

    setTimeout(() => {
      window.open(item.link, "blank");
    }, 1000);
  }

  ngOnDestroy() {
    sessionStorage.clear();
  }
}
