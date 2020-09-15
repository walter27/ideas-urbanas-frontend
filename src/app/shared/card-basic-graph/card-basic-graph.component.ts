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
    sort: "_id",
  };

  imageBase64: any;

  @Input() title: string;
  @Input("variableSelected") variableSelected: Variable;
  @Input() citySelected: Region;
  @Input() showDropCities = false;
  @Input() showDropYears = false;

  years: ItemDropdown[] = [];

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
        fontFamily: '"Noto Sans TC", serif',
        fontSize: 10,
        fontStyle: "normal",
        fontColor: "black",
      },
    },
    hover: { mode: "dataset" },
    tooltips: {
      bodyFontSize: 16,
      titleFontSize: 16,
      bodyFontFamily: '"Noto Sans TC", serif',
      titleFontFamily: '"Noto Sans TC", serif',
      bodyFontStyle: "normal",
      titleFontStyle: "normal",
      enabled: false,
      custom(tooltip) {
        // Tooltip Element
        const t = document.getElementById("chartjs-tooltip");
        if (t) {
          t.remove();
        }
        let tooltipEl = document.getElementById("chartjs-tooltip");
        let title = this._chart.canvas.id;
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
          const afterBody = tooltip["afterBody"];
          const description = afterBody.length > 0 ? afterBody[0] : "";
          const measure_symbol =
            afterBody.length > 1 && afterBody[1] != undefined
              ? " " + afterBody[1]
              : "";

          title += " " + tooltip.dataPoints[0].label;
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
          if (description != undefined && description != "") {
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
          return [
            data.datasets[tooltipItem[0].datasetIndex].data[
            tooltipItem[0].index
            ]["x"],
            data.datasets[tooltipItem[0].datasetIndex].data[
            tooltipItem[0].index
            ]["t"],
          ];
        },
      },
    },
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Año",
            fontFamily: '"Noto Sans TC", serif',
            fontSize: 16,
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
            fontFamily: '"Noto Sans TC", serif',
            fontSize: 16,
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

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  resultData: Data;

  cities: ItemDropdown[] = [];

  constructor(
    private dataService: DataService,
    private regionService: RegionService,
    private chartService: ChartsService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    sessionStorage.setItem("citiesHidden", "[]");
    this.getCities();
  }

  ngOnChanges(changes) {
    if (changes["variableSelected"]) {
      this.getData();
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
      this.getData();
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
          this.getData();
        });
    }
  }

  getYears() {
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
      this.years.push({ id: i.toString(), name: i.toString(), check: true });
    }
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
        this.lineChartOptions.scales.xAxes[0].stacked = true;
        this.lineChartOptions.scales.yAxes[0].stacked = true;
        this.lineChartOptions.scales.yAxes[0].scaleLabel.labelString =
          this.variableSelected.label == ""
            ? "Cantidad"
            : `${this.variableSelected.label} (${this.variableSelected.measure_symbol})`;
        this.lineChartOptions.hover = { mode: "label" };
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
          this.cities.forEach((c) => {
            if (c.id === d.obj_Canton._id) {
              Object.keys(d.value).forEach((k, idx) => {
                this.lineChartData[idx].data.push(d.value[k]);
              });
            }
          });
        });
      } else {
        // lineal
        this.lineChartOptions.scales.xAxes[0].stacked = false;
        this.lineChartOptions.scales.yAxes[0].stacked = false;
        this.lineChartOptions.scales.yAxes[0].scaleLabel.labelString =
          this.variableSelected.label == ""
            ? "Cantidad"
            : `${this.variableSelected.label} (${this.variableSelected.measure_symbol})`;
        this.lineChartOptions.hover = { mode: "dataset" };

        this.cities.forEach((c, idx) => {
          if (c.check) {
            let color = c.color || "";
            let colorStrong = this.getColorStrong(c.color) || "";

            this.lineChartColors.push({
              backgroundColor: color,
            });
            sessionStorage.setItem(c.name.toLowerCase(), color);
            this.lineChartData.push({
              label: formatLabel(c.name),
              data: [],
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
              hoverBorderWidth: 3,
            });
            this.lineChartLabels.forEach((y) => {
              this.lineChartData[this.lineChartData.length - 1].data.push(null);
              this.resultData.forEach((d) => {
                if (d.obj_Canton._id === c.id && d.year.toString() === y) {
                  this.lineChartData[this.lineChartData.length - 1].data[
                    this.lineChartData[this.lineChartData.length - 1].data
                      .length - 1
                  ] = {
                    x: d.description,
                    y: d.value,
                    t: this.variableSelected.measure_symbol,
                  };
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

  getData() {
    this.loading = true;

    let idVariable = null;

    //console.log(this.variableSelected);

    if (this.variableSelected) {
      sessionStorage.setItem(
        "variableSelectedName",
        this.variableSelected.name
      );
      idVariable = this.variableSelected._id;
      this.lineChartType =
        CharType[this.variableSelected.chart_type.split(" ")[0]];
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.dataService
      .listDatasPublic(
        { page: 0, limit: 1000, ascending: true, sort: "obj_Canton.name" },
        idVariable
      )
      .subscribe(
        (data) => {
          this.loading = false;
          this.resultData = data.data;
          this.getYears();
          this.loadData();
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  onCheckItemYear(e) {
    const idx = this.years.findIndex((c) => c.id === e);
    this.years[idx].check = !this.years[idx].check;
    this.loadData();
  }

  getTitle() {
    if (this.title) {
      return this.title;
    } else {
      return this.variableSelected.name;
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
    this.loadData();
  }

  onDownloadCSV(event) {
    let idVariable = null;

    if (this.variableSelected) {
      sessionStorage.setItem(
        "variableSelectedName",
        this.variableSelected.name
      );
      idVariable = this.variableSelected._id;
      this.lineChartType =
        CharType[this.variableSelected.chart_type.split(" ")[0]];
    }

    const date = new Date();

    this.dataService
      .downloadCSV(
        { page: 0, limit: 10000, ascending: true, sort: "obj_Canton.name" },
        idVariable,
        this.cities,
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

  getColorStrong(color) {
    return color != undefined && color != "" ? color.replace(")", ", 08)") : "";
  }
}
