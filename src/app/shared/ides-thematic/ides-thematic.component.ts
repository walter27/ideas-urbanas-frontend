import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  OnDestroy,
  HostListener,
} from "@angular/core";
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


enum CharType {
  lineal = "line",
  bar = "bar",
  stacked = "bar",
  pie = "pie",
}

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

  ctx: any;
  myChart: Chart;
  years: ItemDropdown[] = [];
  cities: ItemDropdown[] = [];
  citiesSelected: ItemDropdown[] = [];
  yearSelected = "";
  imageBase64: any;
  downloadOptions: ItemDropdown[] = [
    {
      id: "pdf",
      name: "PDF",
      check: false,
    },
    {
      id: "csv",
      name: "CSV",
      check: false,
    },
    {
      id: "jpeg",
      name: "JPEG",
      check: false,
    },
    {
      id: "png",
      name: "PNG",
      check: false,
    },
  ];

  public lineChartData: Chart.ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: Chart.ChartOptions & { annotation: any } = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      onLeave(event, legendItem) {
        const index = legendItem.datasetIndex;
        const ci = this.chart;

        ci.data.datasets[index].borderWidth = sessionStorage.getItem(
          "borderWidth"
        );
        ci.data.datasets[index].pointBorderColor =
          ci.data.datasets[index].hoverBorderColor;
        ci.data.datasets[index].pointRadius = window.innerWidth < 575 ? 3 : 7;
        ci.data.datasets[index].pointBackgroundColor = "white";
        ci.data.datasets[index].pointBorderWidth = 1;
        ci.data.datasets[index].backgroundColor = sessionStorage.getItem(
          "backgroundColor"
        );

        // We hid a dataset ... rerender the chart
        ci.update();
      },
      onHover(event, legendItem) {
        const index = legendItem.datasetIndex;
        const ci = this.chart;

        sessionStorage.setItem(
          "borderWidth",
          ci.data.datasets[index].borderWidth
        );
        sessionStorage.setItem(
          "backgroundColor",
          ci.data.datasets[index].backgroundColor
        );

        ci.data.datasets[index].borderWidth =
          ci.data.datasets[index].hoverBorderWidth;
        ci.data.datasets[index].borderColor =
          ci.data.datasets[index].hoverBorderColor;
        ci.data.datasets[index].pointBorderColor =
          ci.data.datasets[index].pointHoverBorderColor;
        ci.data.datasets[index].pointRadius = 5;
        ci.data.datasets[index].pointBackgroundColor =
          ci.data.datasets[index].pointHoverBackgroundColor;
        ci.data.datasets[index].pointBorderWidth = 1;
        ci.data.datasets[index].backgroundColor =
          ci.data.datasets[index].hoverBackgroundColor;

        // We hid a dataset ... rerender the chart
        ci.update();
      },
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
        fontFamily: '"Noto Sans TC", sans-serif',
        fontSize: 10,
        fontColor: "black",
      },
    },
    // 'point' | 'nearest' | 'single' | 'label' | 'index' | 'x-axis' | 'dataset' | 'x' | 'y';
    hover: { mode: "dataset" },
    tooltips: {
      bodyFontSize: 14,
      titleFontSize: 14,
      bodyFontFamily: '"Noto Sans TC", sans-serif',
      titleFontFamily: '"Noto Sans TC", sans-serif',
      backgroundColor: "white",
      bodyFontColor: "black",
      titleFontColor: "#076DCD",
      enabled: false,
      bodySpacing: 10,
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

          const title =
            sessionStorage.getItem("variableSelectedName") +
            " " +
            tooltip.dataPoints[0].label;
          const titleLines = [title];
          const bodyLines = tooltip.body.map(getBody);
          const measure_symbol =
            " " + sessionStorage.getItem("variableSelectedMeasureSymbol");

          let innerHtml = '<thead style="color: rgba(7, 109, 205, 1)">';

          titleLines.forEach(function (title) {
            innerHtml += "<tr><th>" + title + "</th></tr>";
          });
          innerHtml += "</thead><tbody>";

          bodyLines.forEach(function (body, i) {
            const color = sessionStorage.getItem(
              body[0].split(":")[0].toLocaleLowerCase()
            );
            const colors = { backgroundColor: color, borderColor: "white" }; // tooltip.labelColors[i];
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
              measure_symbol +
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
          const vsn = sessionStorage.getItem("variableSelectedName");
          return vsn + " " + item[0].xLabel.toString();
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
        afterBody(tooltipItem, data) {
          // tslint:disable-next-line:no-string-literal
          return data.datasets[tooltipItem[0].datasetIndex].data[
            tooltipItem[0].index
          ]["x"];
        },
      },
    },
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Año",
            fontFamily: '"Noto Sans TC", sans-serif',
            fontSize: window.innerWidth < 575 ? 10 : 16,
          },
          gridLines: {
            lineWidth: 0,
          },
        },
      ],
      yAxes: [
        {
          id: "y-axis-0",
          position: "left",
          ticks: {
            beginAtZero: true,
            callback(value, index, values) {
              // tslint:disable-next-line:radix
              if (Number(value) >= 1000) {
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
              } else {
                return value;
              }
            },
          },
          scaleLabel: {
            display: true,
            labelString: "Cantidad",
            fontFamily: '"Noto Sans TC", sans-serif',
            fontSize: window.innerWidth < 575 ? 10 : 16,
          },
        },
      ],
    },
    annotation: {},
  };
  public lineChartColors: Color[] = [];
  public lineChartLegend = true;
  public lineChartType = "line";
  public lineChartPlugins = [pluginAnnotations];
  loadCity = false;

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(
    private clasificationService: ClasificationService,
    private variableService: VariableService,
    private dataService: DataService,
    private regionService: RegionService,
    private chartService: ChartsService,
    private utilsService: UtilsService,
    private router: Router
  ) { }

  ngOnInit() {
    sessionStorage.clear();

    this.loadCity = true;
    this.getCities();

    /*if (this.router.url !== "/home") {
      this.getCities();
      
    }*/
  }

  /*@HostListener("window:scroll", ["$event"])
  onWindowScroll($event) {
    if (
      !this.loadCity &&
      this.router.url === "/home" &&
      $event.srcElement.scrollingElement.scrollTop > 100
    ) {
      this.loadCity = true;
      this.getCities();
    }
  }*/

  getCities() {
    this.regionService
      .listRegionsPublic(
        { page: 0, limit: 1000, ascending: true, sort: "_id" },
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
            this.variableSelected.label
          );
          sessionStorage.setItem(
            "variableSelectedMeasureSymbol",
            this.variableSelected.measure_symbol
          );
          this.getData();
          return resp;
        })
      );
  }

  getYearsAndCities() {
    this.years = [];

    const setYears = new Set();

    this.resultData.forEach((resp) => {
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
    this.loadData2();
  }

  getVariableSelected() {
    //console.log(this.variableSelected);
    this.onSelectVariable(this.variableSelected);
    //this.loadData2();
  }

  loadData2() {
    this.lineChartData = [];
    this.lineChartLabels = [];

    //console.log(this.citiesSelected);

    this.lineChartLabels = this.years
      .filter((y) => {
        if (y.check) {
          return true;
        }
        return false;
      })
      .map((y) => y.name);

    if (
      this.lineChartType === CharType.lineal ||
      this.lineChartType === CharType.bar
    ) {
      if (this.variableSelected.chart_type.split(" ")[0] === "stacked") {
        this.lineChartOptions.scales.xAxes[0].scaleLabel.labelString =
          "Ciudades";
        this.lineChartOptions.scales.yAxes[0].scaleLabel.labelString =
          sessionStorage.getItem("variableSelectedLabel") == ""
            ? "Cantidad"
            : sessionStorage.getItem("variableSelectedLabel");

        this.lineChartOptions.scales.xAxes[0].stacked = true;
        this.lineChartOptions.scales.yAxes[0].stacked = true;
        this.lineChartOptions.hover = { mode: "label" };

        this.lineChartLabels = [];
        this.lineChartColors = [
          { backgroundColor: "#004587" },
          { backgroundColor: "#076DCD" },
          { backgroundColor: "#FFDA20" },
          { backgroundColor: "#F8A901" },
          { backgroundColor: "#1BD4D4" },
          { backgroundColor: "#AAD6FF" },
          { backgroundColor: "#8F8F8F" },
          { backgroundColor: "#BFBFBF" },
          { backgroundColor: "#E3E3E3" },
        ];

        Object.keys(this.resultData[0].value).forEach((k) => {
          this.lineChartData.push({
            label: capitalizeFirst(k),
            data: Array<Chart.ChartPoint>(),
            stack: "a",
          });
        });

        this.resultData.forEach((d) => {
          if (d.year.toString() === this.yearSelected) {
            //console.log(formatLabel(d.obj_Canton.name));

            this.citiesSelected.forEach((c) => {
              // console.log(c.name);

              if (formatLabel(d.obj_Canton.name) === c.name) {
                this.lineChartLabels.push(formatLabel(d.obj_Canton.name));

                Object.keys(d.value).forEach((k, idx) => {
                  this.lineChartData[idx].data.push(d.value[k]);
                });
              }
            });
          }
        });
        /* console.log(this.lineChartLabels);
         this.citiesSelected.forEach(d => {
           console.log(d.name);
 
         });*/
      } else {
        this.lineChartOptions.scales.xAxes[0].stacked = false;
        this.lineChartOptions.scales.yAxes[0].stacked = false;

        this.lineChartOptions.scales.xAxes[0].scaleLabel.labelString = "Año";
        this.lineChartOptions.scales.yAxes[0].scaleLabel.labelString =
          sessionStorage.getItem("variableSelectedLabel") == ""
            ? "Cantidad"
            : sessionStorage.getItem("variableSelectedLabel");
        this.lineChartOptions.hover = { mode: "dataset" };

        // lineal
        this.citiesSelected.forEach((c, idx) => {
          const ch = JSON.parse(sessionStorage.getItem("citiesHidden"));
          if (c.check) {
            let color = c.color || "";
            let colorStrong = this.getColorStrong(c.color) || "";

            this.lineChartColors.push({
              backgroundColor: color,
            });
            sessionStorage.setItem(c.name.toLowerCase(), color);
            let hidden = false;
            if (ch && ch.indexOf(c.name) !== -1) {
              hidden = true;
            }
            this.lineChartData.push({
              label: formatLabel(c.name),
              data: Array<Chart.ChartPoint>(),
              fill: false,
              borderColor: colorStrong,
              pointBorderColor: color,
              pointBackgroundColor: "white",
              pointRadius: 2,
              borderWidth: 2,
              pointHoverRadius: 4,
              pointHoverBackgroundColor: colorStrong,
              pointHoverBorderWidth: 1,
              hoverRadius: 8,
              pointHoverBorderColor: "white",
              hoverBorderColor: colorStrong,
              hoverBorderWidth: 4,
              hoverBackgroundColor: colorStrong,
              backgroundColor: color,
              hidden,
            });
            this.lineChartLabels.forEach((y) => {
              this.lineChartData[this.lineChartData.length - 1].data.push(null);
              this.resultData.forEach((d) => {
                if (d.obj_Canton._id === c.id && d.year.toString() === y) {
                  this.lineChartData[this.lineChartData.length - 1].data[
                    this.lineChartData[this.lineChartData.length - 1].data
                      .length - 1
                  ] = { x: d.description, y: d.value };
                }
              });
            });
          }
        });
      }
    } else {
      this.citiesSelected.forEach((c) => {
        if (c.check) {
          this.lineChartData.push({
            label: formatLabel(c.name),
            data: [],
            fill: false,
          });
          this.lineChartLabels.forEach((y) => {
            this.lineChartData[this.lineChartData.length - 1].data.push(null);
            this.resultData.forEach((d) => {
              if (d.obj_Canton._id === c.id && d.year.toString() === y) {
                this.lineChartData[this.lineChartData.length - 1].data[
                  this.lineChartData[this.lineChartData.length - 1].data
                    .length - 1
                ] = d.value.electricidad;
              }
            });
          });
        }
      });
    }

    setTimeout(() => {
      this.chartService.imageBase24.then((value) => {
        this.imageBase64 = {
          name: "chart",
          data: value,
          type: "chart",
        };
      });
    }, 3000);
  }

  loadData() {
    this.lineChartData = [];
    this.lineChartLabels = [];

    this.lineChartLabels = this.years
      .filter((y) => {
        if (y.check) {
          return true;
        }
        return false;
      })
      .map((y) => y.name);

    if (
      this.lineChartType === CharType.lineal ||
      this.lineChartType === CharType.bar
    ) {
      if (this.variableSelected.chart_type.split(" ")[0] === "stacked") {
        this.lineChartOptions.scales.xAxes[0].scaleLabel.labelString =
          "Ciudades";
        this.lineChartOptions.scales.yAxes[0].scaleLabel.labelString =
          sessionStorage.getItem("variableSelectedLabel") == ""
            ? "Cantidad"
            : sessionStorage.getItem("variableSelectedLabel");

        this.lineChartOptions.scales.xAxes[0].stacked = true;
        this.lineChartOptions.scales.yAxes[0].stacked = true;
        this.lineChartOptions.hover = { mode: "label" };

        this.lineChartLabels = [];
        this.lineChartColors = [
          { backgroundColor: "#004587" },
          { backgroundColor: "#076DCD" },
          { backgroundColor: "#FFDA20" },
          { backgroundColor: "#F8A901" },
          { backgroundColor: "#1BD4D4" },
          { backgroundColor: "#AAD6FF" },
          { backgroundColor: "#8F8F8F" },
          { backgroundColor: "#BFBFBF" },
          { backgroundColor: "#E3E3E3" },
        ];

        Object.keys(this.resultData[0].value).forEach((k) => {
          this.lineChartData.push({
            label: capitalizeFirst(k),
            data: Array<Chart.ChartPoint>(),
            stack: "a",
          });
        });

        this.resultData.forEach((d) => {
          if (d.year.toString() === this.yearSelected) {
            this.lineChartLabels.push(formatLabel(d.obj_Canton.name));

            Object.keys(d.value).forEach((k, idx) => {
              this.lineChartData[idx].data.push(d.value[k]);
            });
          }
        });
      } else {
        this.lineChartOptions.scales.xAxes[0].stacked = false;
        this.lineChartOptions.scales.yAxes[0].stacked = false;

        this.lineChartOptions.scales.xAxes[0].scaleLabel.labelString = "Año";
        this.lineChartOptions.scales.yAxes[0].scaleLabel.labelString =
          sessionStorage.getItem("variableSelectedLabel") == ""
            ? "Cantidad"
            : sessionStorage.getItem("variableSelectedLabel");
        this.lineChartOptions.hover = { mode: "dataset" };

        // lineal
        this.cities.forEach((c, idx) => {
          const ch = JSON.parse(sessionStorage.getItem("citiesHidden"));
          if (c.check) {
            let color = c.color || "";
            let colorStrong = this.getColorStrong(c.color) || "";

            this.lineChartColors.push({
              backgroundColor: color,
            });
            sessionStorage.setItem(c.name.toLowerCase(), color);
            let hidden = false;
            if (ch && ch.indexOf(c.name) !== -1) {
              hidden = true;
            }
            this.lineChartData.push({
              label: formatLabel(c.name),
              data: Array<Chart.ChartPoint>(),
              fill: false,
              borderColor: colorStrong,
              pointBorderColor: color,
              pointBackgroundColor: "white",
              pointRadius: 2,
              borderWidth: 2,
              pointHoverRadius: 4,
              pointHoverBackgroundColor: colorStrong,
              pointHoverBorderWidth: 1,
              hoverRadius: 8,
              pointHoverBorderColor: "white",
              hoverBorderColor: colorStrong,
              hoverBorderWidth: 4,
              hoverBackgroundColor: colorStrong,
              backgroundColor: color,
              hidden,
            });
            this.lineChartLabels.forEach((y) => {
              this.lineChartData[this.lineChartData.length - 1].data.push(null);
              this.resultData.forEach((d) => {
                if (d.obj_Canton._id === c.id && d.year.toString() === y) {
                  this.lineChartData[this.lineChartData.length - 1].data[
                    this.lineChartData[this.lineChartData.length - 1].data
                      .length - 1
                  ] = { x: d.description, y: d.value };
                }
              });
            });
          }
        });
      }
    } else {
      this.cities.forEach((c) => {
        if (c.check) {
          this.lineChartData.push({
            label: formatLabel(c.name),
            data: [],
            fill: false,
          });
          this.lineChartLabels.forEach((y) => {
            this.lineChartData[this.lineChartData.length - 1].data.push(null);
            this.resultData.forEach((d) => {
              if (d.obj_Canton._id === c.id && d.year.toString() === y) {
                this.lineChartData[this.lineChartData.length - 1].data[
                  this.lineChartData[this.lineChartData.length - 1].data
                    .length - 1
                ] = d.value.electricidad;
              }
            });
          });
        }
      });
    }
  }

  getData() {
    this.loading = true;

    let idVariable = null;

    if (this.variableSelected) {
      idVariable = this.variableSelected._id;
      this.lineChartType =
        CharType[this.variableSelected.chart_type.split(" ")[0]];
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.dataService
      .listDatasPublic(
        { page: 0, limit: 2000, ascending: true, sort: "obj_Canton.name" },
        idVariable
      )
      .subscribe(
        (data) => {
          this.loading = false;
          this.resultData = data.data;
          this.getYearsAndCities();
          if (this.citiesSelected.length === 0) {
            this.citiesSelected.push(this.cities[0]);
            this.loadData2();
          }
          this.loadData2();

          //this.loadData();
        },
        (err) => {
          this.loading = false;
        }
      );
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
      this.variableSelected.label
    );
    sessionStorage.setItem(
      "variableSelectedMeasureSymbol",
      this.variableSelected.measure_symbol
    );
    sessionStorage.removeItem("citiesHidden");
    this.getData();
  }

  onCheckItemCity(e) {
    const idx = this.citiesSelected.findIndex((c) => c.id === e);
    this.citiesSelected[idx].check = !this.citiesSelected[idx].check;
    this.loadData2();
    //this.loadData();
  }

  onCheckItemYear(e) {
    const idx = this.years.findIndex((c) => c.id === e);
    this.years[idx].check = !this.years[idx].check;
    this.loadData2();
    //this.loadData();
  }

  downloadCanvas(event, typeDownload) {
    const anchor = event.target;
    const canvas = document.getElementById(
      this.variableSelected._id
    ) as HTMLCanvasElement;
    const pdf = new jsPDF();

    switch (typeDownload) {
      case "pdf": {
        const url = canvas.toDataURL();
        pdf.addImage(url, "JPEG", 0, 0);
        pdf.save("download.pdf");
        break;
      }
      case "csv": {
        // console.log('csv');
        break;
      }
      case "png": {
        const url = canvas.toDataURL();
        anchor.href = url;
        anchor.download = "download.png";
        break;
      }
      default: {
        // jpeg
        const url = canvas.toDataURL("image/jpeg");
        anchor.href = url;
        anchor.download = "download.jpeg";
        break;
      }
    }
  }

  sliderChange(e) {
    for (let i = this.options.floor; i <= this.options.ceil; i++) {
      if (i < e.value || i > e.highValue) {
        const idx = this.years.findIndex((c) => +c.id === i);
        this.years[idx].check = false;
      } else {
        const idx = this.years.findIndex((c) => +c.id === i);
        this.years[idx].check = true;
      }
    }
    this.loadData2();
    //this.loadData();
  }

  onDownloadCSV(event) {
    let idVariable = null;

    if (this.variableSelected) {
      idVariable = this.variableSelected._id;
      this.lineChartType =
        CharType[this.variableSelected.chart_type.split(" ")[0]];
    }

    const date = new Date();

    this.dataService
      .downloadCSV(
        { page: 0, limit: 10000, ascending: true, sort: "obj_Canton.name" },
        idVariable,
        this.citiesSelected,
        this.years
      )
      .subscribe((data) => {
        const parsedResponse = data;
        const blob = new Blob([parsedResponse], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        if (navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, event + ".csv");
        } else {
          const a = document.createElement("a");
          a.href = url;
          a.download =
            "data-" + this.utilsService.getStringFromDateNow() + ".csv";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        window.URL.revokeObjectURL(url);
      });
  }

  onCheckYear(e) {
    this.yearSelected = e;
    this.loadData2();
    //this.loadData();
  }

  ngOnDestroy() {
    sessionStorage.clear();
  }

  getColorStrong(color) {
    return color != undefined && color != "" ? color.replace(")", ", 08)") : "";
  }
}
