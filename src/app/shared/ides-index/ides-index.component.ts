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
import { map } from "rxjs/operators";
import { SelectItem } from "primeng/api";
import { ChartsService } from "src/app/core/services/charts.service";

let { capitalizeFirst } = require("../../core/utils/utils");

@Component({
  selector: "app-ides-index",
  templateUrl: "./ides-index.component.html",
  styleUrls: ["./ides-index.component.scss"],
})
export class IdesIndexComponent implements OnInit, OnDestroy {
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

  @Input() marginAuto = false;
  @Input() title: string;
  @Input() variableSelected: Variable;
  @Input() citySelected: Region;
  @Input() showDropCities = false;
  @Input() showDropYears = false;
  @Input() activeCities: ItemDropdown[] = [];
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
  filterData: any;
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
  columnaDownload: string;
  imageBase64: any;

  constructor(
    private dataService: DataService,
    private regionService: RegionService,
    private chartService: ChartsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData = true;
    this.getData();
    /*if (this.router.url !== '/home') {
      this.getData();
    }*/
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

    setTimeout(() => {
      
      this.chartService.imageRadarBase24.then((value) => {
        this.imageBase64 = {
          name: 'chart',
          data: value,
          type:'radar'
        };
      });
    }, 3000);
  }

  getData() {
    if (this.citySelected) {
      this.dataService
        .listDataIndexes(this.citySelected._id)
        .subscribe((resp) => {
          this.baseData = resp;
          this.updateChart(resp);
          this.columnaDownload = "col-md-12";
        });
    } else {
      this.columnaDownload = "col-md-6";
      this.dataService.listDataIndexes().subscribe((resp) => {
        this.baseData = resp;
        this.cantons = [];
        Object.keys(resp).forEach((c) => {
          this.cantons.push({
            name: c,
          });
        });
        this.getCantonsSelected();
      });
    }
  }

  getCantonsSelected() {
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
  }

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

  ngOnDestroy() {
    sessionStorage.clear();
  }
}
